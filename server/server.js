'use strict';

const express = require('express');
const morgan = require('morgan');
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const carDao = require("./dao/car_dao");
const paymentDao = require("./dao/payment_dao_stub");
const rentalDao = require("./dao/rental_dao");
const userDao = require("./dao/user_dao");

const jwtSecret = require("./secret").jwtSecret;
const expireTime = 300;  // 5 minutes

// setup app dependencies
const port = 3001;
const app = express();
app.use(morgan('tiny'));
app.use(express.json())

const prefix = "/api";

// REST APIs - always begin with /api

// /user APIs

// POST /user/login
// request: {email, password}
// response:
//  404 - user not found
//  401 - wrong password
//  200 - login successful
app.post(prefix + "/user/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    userDao.getUser(email)
        .then(user => {
            if (user === undefined)
                res.status(404).end();
            else {
                if (!userDao.checkPassword(user, password))
                    res.status(401).end();
                else {
                    const token = jsonwebtoken.sign({user: user.id}, jwtSecret, {expiresIn: expireTime});
                    res.cookie('token', token, {httpOnly: true, sameSite: true, maxAge: 1000 * expireTime});
                    res.status(200).end();
                }
            }
        })
        // delay next login by 2 seconds
        .catch(err => new Promise((resolve) => {setTimeout(resolve, 2000)}).then(() => res.status(401).end()));
});

app.use(cookieParser());

// POST /user/logout
// request: none
// response:
//  200 - logout successful
app.post(prefix + '/user/logout', (req, res) => {
        res.clearCookie('token').status(200).end();
    }
);

// For the rest of the code, all APIs require authentication
app.use(
    jwt({
        secret: jwtSecret,
        getToken: req => req.cookies.token
    })
);

// GET /user/:userId
// request: none
// response:
//  404 - user not found
//  401 - authentication error
//  200 - {id, email, name, hash}
app.get(prefix + "/user/:userId", (req, res) => {
     userDao.getUserById(req.params.userId)
        .then(user => {
            if (user === undefined)
                res.status(404).end();
            else {
                res.status(200).json({
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                }).end();
            }
        })
        // delay next try by 2 seconds
        .catch(err => new Promise((resolve) => {setTimeout(resolve, 2000)}).then(() => res.status(401).end()));
});

// /cars APIs

// GET /cars/:carId
// request: none
// response:
//  404 - car not found
//  401 - authentication error
//  200 - {id, category, brand, model,
//         optional[description, kilometers, year, fuel, value, kmperlitre, passengers, stickshift]}
app.get(prefix + "/cars/:carId", (req, res) => {
    carDao.getCar(req.params.carId)
        .then(car => {
            if (car === undefined)
                res.status(404).end();
            else {
                // the response body automatically ignores null fields
                res.status(200).json(car).end();
            }
        })
        // delay next try by 2 seconds
        .catch(err => new Promise((resolve) => {setTimeout(resolve, 2000)}).then(() => res.status(401).end()));
});

// GET /cars
// request: none
// response:
//  404 - no cars in database
//  401 - authentication error
//  200 -  list of car objects:
//         {id, category, brand, model,
//         optional[description, kilometers, year, fuel, value, kmperlitre, passengers, stickshift]}
// the filter will be implemented in the front end because:
//  - it's a simpler implementation, based on the buttons selected at the moment
//  - it only requires 1 HTTP Request once for all cars, instead of 1 HTTP Request for each filter selection
// in the case of many more database entries than the ~20 we have in this project, a better solution would be to
// implement an API which requests results in batch, like Amazon or Google results (e.g. 20 results per "page")
app.get(prefix + "/cars", (req, res) => {
    carDao.getCars()
        .then(cars => {
            if (cars.length === 0)
                res.status(404).end();
            else {
                res.status(200).json(cars).end();
            }
        })
        // delay next try by 2 seconds
        .catch(err => new Promise((resolve) => {setTimeout(resolve, 2000)}).then(() => res.status(401).end()));
});


// /rentals APIs

// to toggle between canceled and not canceled
// POST /rentals/:rentalId
// request: none
// response:
//  404 - rental not found
//  401 - authentication error
//  200 - canceled property toggled
// another solution would have been a PUT API which receives the whole rental object with the canceled property updated,
// but I've discarded it since it would be harder on the client side and more prone to error
app.post(prefix + "/rentals/:rentalId", (req, res) => {
    rentalDao.toggleCanceled(req.params.rentalId)
        .then(result => {
            if (result === null)
                res.status(200).end();
            else
                res.status(404).end();
        })
        // delay next try by 2 seconds
        .catch(err => new Promise((resolve) => {setTimeout(resolve, 2000)}).then(() => res.status(401).end()));
});

// to check if a user has a discount
// and if already has a rental in a certain period of time
// GET /rentals/:userId
// query: ?type=user or ?type=car
// request: none
// response:
//  404 - no rentals found
//  400 - bad request type not found
//  200 - list of rental objects:
//        {id, startingDay, endDay, carCategory, driversAge, extraDrivers, estimatedKilometers, insurance, carId, userId}
app.get(prefix + "/rentals/:id", (req, res) => {
    if (req.query.type === "user" || req.query.type === "car")
        rentalDao.getRentalsById(req.params.id, req.query.type)
            .then(rentals => {
                if (rentals)
                    res.status(200).json(rentals).end();
                else
                    res.status(404).end();
            })
            // delay next try by 2 seconds
            .catch(err => new Promise((resolve) => {setTimeout(resolve, 2000)}).then(() => res.status(401).end()));
    else
        res.status(400).end();
});

// POST /payment
// request: {fullName, cardNumber, CVV, amount}
// response:
//  401 - authentication error
//  400 - missing details from request
//  200 - payment successful
//  XXX - payment failed (no handling required)
app.post(prefix + "/payment", (req, res) => {
    const details = req.body;
    const {fullName, cardNumber, CVV, amount} = details;
    if (fullName && cardNumber && CVV && amount)
        if (typeof fullName === "string" && typeof cardNumber === "number" && typeof CVV === "number" && typeof amount === "number" &&
            fullName.length > 0 && cardNumber.toString().length === 16 && CVV.toString().length === 3 && amount > 0)
                paymentDao.pay(details)
                    .then(result => {
                        if (result === null)  // always true, see stub
                            res.status(200).end();
                    })
                    // delay next try by 2 seconds
                    .catch(err => new Promise((resolve) => {setTimeout(resolve, 2000)}).then(() => res.status(401).end()));
        else
            res.status(400).json({"errors": "Payment details wrongly formatted."}).end();
    else
        res.status(400).json({"errors": "Missing payment details."}).end();
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}/`));