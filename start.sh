#!/bin/bash

# exit after any error
set -e

# start client React development server in the background, after installing dependencies
echo "Starting client development server..."
cd client
npm install
npm start &
echo "Client development server started"

# start API server in the foreground, after installing dependencies
echo "Starting API server..."
cd ../server
npm install
nodemon server.js 

