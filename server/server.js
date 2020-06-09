'use strict';

const express = require('express');
const morgan = require('morgan');

const port = 3001;

// setup app dependencies
const app = express();
app.use(morgan('tiny'));
app.use(express.json())



app.listen(port, () => console.log(`Server running on http://localhost:${port}/`));