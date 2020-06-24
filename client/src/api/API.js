import Car from "../entities/Car";
import Rental from "../entities/Rental";
import {kmPerDayLUT, loginErrorLUT, serverErrorLUT} from "../utils/luts";

const prefix = "/api";

// User related APIs

async function isLoggedIn() {
    return new Promise((resolve, reject) => {
        fetch(prefix + "/user")
            .then(res => {
                if (res.ok)
                    resolve(res.json());
                else if (res.status === 401)
                    reject(serverErrorLUT.authentication);
                else
                    reject(serverErrorLUT.generic)
            })
            .catch(err => reject(serverErrorLUT.unavailable));
    });
}

async function login(email, password) {
    return new Promise((resolve, reject) => {
        fetch(prefix + "/user/login",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: email, password: password})
            })
            .then(res => {
                if (res.ok)
                    resolve(res.json());
                else if (res.status === 404)
                    reject(loginErrorLUT.email)
                else if (res.status === 401)
                    reject(loginErrorLUT.password)
                else  // should not happen, but if it does:
                    reject(loginErrorLUT.default)
            })
            .catch(err => reject(serverErrorLUT.unavailable));
    });
}

async function logout() {
    return new Promise((resolve, reject) => {
        fetch(prefix + "/user/logout", {method: "POST"})
            .then(res => {
                if (res.ok)
                    resolve(null);
                else // should not happen
                    reject(serverErrorLUT.generic)
            })
            .catch(err => reject(serverErrorLUT.unavailable));
    });
}

// Car related APIs

async function getAllCars() {
    return new Promise((resolve, reject) => {
        fetch(prefix + "/cars")
            .then(res => {
                if (res.status === 404)
                    resolve([]);
                res.json()
                    .then(json => resolve(json.map(car => Car.from(car))))
                    .catch(err => reject(serverErrorLUT.generic));
            })
            .catch(err => reject(serverErrorLUT.unavailable));
    });
}

async function getCarById(carId) {
    return new Promise((resolve, reject) => {
        fetch(prefix + "/cars/" + carId)
            .then(res => {
                if (res.status === 404)
                    reject(`Car with id=${carId} not found`);
                else if (res.status === 401)
                    reject(serverErrorLUT.authentication);
                else if (res.ok)
                    res.json()
                        .then(json => resolve(Car.from(json)))
                        .catch(err => reject(serverErrorLUT.generic));
                else
                    reject(serverErrorLUT.generic);
            })
            .catch(err => reject(serverErrorLUT.unavailable));
    });
}

// Rental related APIs

async function toggleCanceledByRentalId(rentalId) {
    return new Promise((resolve, reject) => {
        fetch(prefix + "/rentals/" + rentalId, {method: "POST"})
            .then(res => {
                if (res.status === 404)
                    reject(`Rental with id=${rentalId} not found`);
                else if (res.status === 401)
                    reject(serverErrorLUT.authentication);
                else if (res.ok)
                    resolve(null);
                else
                    reject(serverErrorLUT.generic);
            })
            .catch(err => reject(serverErrorLUT.unavailable));
    });
}

async function saveRental(rental) {
    let {
        startingDay,
        endDay,
        carCategory,
        driversAge,
        driversAgeSpecific,
        extraDrivers,
        extraDriversSpecific,
        estimatedKilometers,
        insurance,
        carId,
        userId,
        amount,
    } = rental;

    // convert tri-state and boolean values to acceptable SQLite int values
    switch (estimatedKilometers) {
        case kmPerDayLUT.under50:
            estimatedKilometers = 0;
            break;
        case kmPerDayLUT.between50and150:
            estimatedKilometers = 1;
            break;
        case kmPerDayLUT.over150:
            estimatedKilometers = 2;
            break;
        default:
            break;
    }
    extraDrivers = extraDrivers ? 1 : 0;
    insurance = insurance ? 1 : 0;

    return new Promise((resolve, reject) => {
        fetch(prefix + "/rentals", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                startingDay,
                endDay,
                carCategory,
                driversAge,
                driversAgeSpecific: +driversAgeSpecific,
                extraDrivers,
                extraDriversSpecific: +extraDriversSpecific,
                estimatedKilometers,
                insurance,
                carId,
                userId,
                amount: +amount,
            })
        })
            .then(res => {
                if (res.status === 400)
                    reject(serverErrorLUT.missingParameter);
                else if (res.status === 401)
                    reject(serverErrorLUT.authentication);
                else if (res.status === 500)
                    reject(serverErrorLUT.generic);
                else
                    resolve(res);
            })
            .catch(err => reject(serverErrorLUT.unavailable));
    });
}

async function getRentalsByUserId(userId) {
    return new Promise((resolve, reject) => {
        fetch(prefix + "/rentals/" + userId)
            .then(res => {
                if (res.status === 404)
                    reject(`No rental for user with id=${userId} found`);
                else if (res.status === 401)
                    reject(serverErrorLUT.authentication);
                else if (res.ok)
                    res.json()
                        .then(json => resolve(json.map(rental => Rental.from(rental))))
                        .catch(err => reject(serverErrorLUT.generic));
                else
                    reject(serverErrorLUT.generic);
            })
            .catch(err => reject(serverErrorLUT.unavailable));
    });
}

async function getAllRentals() {
    return new Promise((resolve, reject) => {
        fetch(prefix + "/rentals")
            .then(res => {
                if (res.status === 404)
                    reject("No rentals in database");
                else if (res.status === 401)
                    reject(serverErrorLUT.authentication);
                else if (res.ok)
                    res.json()
                        .then(json => resolve(json.map(rental => Rental.from(rental))))
                        .catch(err => reject(serverErrorLUT.generic));
                else
                    reject(serverErrorLUT.generic);
            })
            .catch(err => reject(serverErrorLUT.unavailable));
    });
}

// Payment related APIs

async function pay(data) {
    return new Promise((resolve, reject) => {
        fetch(prefix + "/payment",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),  // {details, rental}
            })
            .then(res => {
                if (res.status === 401)
                    reject(serverErrorLUT.authentication);
                else if (res.status === 400 || res.status === 418)
                    reject(res.body.errors)
                else if (res.ok)
                    resolve(null)
                else
                    reject(serverErrorLUT.generic);
            })
            .catch(err => reject(serverErrorLUT.unavailable));
    });
}

const API = {isLoggedIn, login, logout, getAllCars, getCarById, toggleCanceledByRentalId, saveRental, getRentalsByUserId, getAllRentals, pay};
export default API;