# Exam #1: "Car Rental"
## Student: s280124 Castelli Enrico 

## React client application routes

- Route `/`: home page with view of unique available cars; two filters allow to choose multiple brands and categories dynamically
- Route `/login`: login form
- Route `/logout`: redirects to home page after deleting the authentication cookie
- Route `/resetpassword`: demo, no mail server required in this project
- Route `/rent`: configurator form, dynamically displays the number of available cars for a period of time and a category, plus the price given a set of parameters; allows to proceed to payment once filled
- Route `/payment`: payment form, dynamically shows "Pay now" button once all details are entered
- Route `/rentals`: allows an authenticated user to see all their reservations, and to cancel the future reservations

## REST API server

- POST `/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Server database

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Configurator Screenshot](./img/screenshot.jpg)

## Test users
Format: email, password (is frequent customer)  

* jd@sacredheart.com, ImNoSuperman (frequent customer)
* elliot.reid@gmail.com, blond3d0ctor
* chocolate.bear@yahoo.com, Izzie2008
* carla.espinoza@hotmail.com, dominican35
* percival.ulysses.cox@icloud.com, Jackie
* b.kelso@sacredheart.com, Johnny1942