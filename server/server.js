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

// GET /user/:userId
// request: none
// response:
//  404 - user not found
//  401 - authentication error
//  200 - {id, email, name, hash}
// TODO: forbid access to unauthenticated users with cookies
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
// TODO: forbid access to unauthenticated users with cookies
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
// TODO: forbid access to unauthenticated users with cookies
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


// to check if a user has a discount
// and if already has a rental in a certain period of time
// GET /rentals/:userId
// request: {"type": "user"}
// response:
//  200 - list of rental objects:
//        {id, startingDay, endDay, carCategory, driversAge, extraDrivers, estimatedKilometers, insurance, carId, userId}

// to check if a car is rented in a period of time
// GET /rentals/:carId
// request: {"type": "car"}
// response:
//  200 - list of rental objects:
//        {id, startingDay, endDay, carCategory, driversAge, extraDrivers, estimatedKilometers, insurance, carId, userId}

// POST /payment
// request: {fullName, cardNumber, CVV, amount}
// response:
//  401 - authentication error
//  200 - payment successful
//  XXX - payment failed (no handling required)

app.listen(port, () => console.log(`Server running on http://localhost:${port}/`));