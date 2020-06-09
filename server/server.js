'use strict';

const express = require('express');
const morgan = require('morgan');

const port = 3001;

// setup app dependencies
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

// POST /user/logout
// request: none
// response:
//  200 - logout successful

// GET /user/:userId
// request: none
// response:
//  404 - user not found
//  401 - authentication error
//  200 - {id, email, name, hash}

// /cars APIs

// GET /cars/:carId
// request: none
// response:
//  404 - car not found
//  401 - authentication error
//  200 - {id, category, brand, model,
//         optional[description, kilometers, year, fuel, value, kmperlitre, passengers, stickshift]}

// GET /cars
// request: none
// response:
//  401 - authentication error
//  200 -  list of car objects:
//         {id, category, brand, model,
//         optional[description, kilometers, year, fuel, value, kmperlitre, passengers, stickshift]}
// the filter will be implemented in the front end because:
//  - it's a simpler implementation, based on the buttons selected at the moment
//  - it only requires 1 HTTP Request once for all cars, instead of 1 HTTP Request for each filter selection
// in the case of many more database entries than the ~20 we have in this project, a better solution would be to
// implement an API which requests results in batch, like Amazon or Google results (e.g. 20 results per "page")


// /rentals APIs

// to toggle between canceled and not canceled
// POST /rentals/:rentalId
// request: none
// response:
// 200 - canceled property toggled

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