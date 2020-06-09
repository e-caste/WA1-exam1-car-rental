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

// /user/login
// POST
// request: {username, password}
// response:
//  404 - user not found
//  401 - wrong password
//  200 - login successful

// /user/logout
// POST
// request: none
// response:
//  200 - logout successful

// /car APIs

// /rental APIs

app.listen(port, () => console.log(`Server running on http://localhost:${port}/`));