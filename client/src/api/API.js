import Car from "../entities/Car";
import Rental from "../entities/Rental";

const prefix = "/api";

// User related APIs

async function isLoggedIn() {
    return new Promise((resolve, reject) => {
        fetch(prefix + "/user")
            .then(res => {
                if (res.ok)
                    resolve(res.json());
                else if (res.status === 401)
                    reject("Authentication error");
                else
                    reject("Server error")
            })
            .catch(err => reject("Server unavailable"));
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
                    reject("Email not found")
                else if (res.status === 401)
                    reject("Invalid password")
                else  // should not happen, but if it does:
                    reject("Server error")
            })
            .catch(err => reject("Server unavailable"));
    });
}

async function logout(email, password) {
    return new Promise((resolve, reject) => {
        fetch(prefix + "/user/logout", {method: "POST"})
            .then(res => {
                if (res.ok)
                    resolve(null);
                else // should not happen
                    reject("Server error")
            })
            .catch(err => reject("Server unavailable"));
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
                    .catch(err => reject("Server error"));
            })
            .catch(err => reject("Server unavailable"));
    });
}

async function getCarById(carId) {
    return new Promise((resolve, reject) => {
        fetch(prefix + "/cars/" + carId)
            .then(res => {
                if (res.status === 404)
                    reject(`Car with id=${carId} not found`);
                else if (res.status === 401)
                    reject("Authentication error");
                else if (res.ok)
                    res.json()
                        .then(json => resolve(Car.from(json)))
                        .catch(err => reject("Server error"));
                else
                    reject("Server error");
            })
            .catch(err => reject("Server unavailable"));
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
                    reject("Authentication error");
                else if (res.ok)
                    res.json()
                        .then(json => resolve(Rental.from(json)))
                        .catch(err => reject("Server error"));
                else
                    reject("Server error");
            })
            .catch(err => reject("Server unavailable"));
    });
}

async function getRentalsByUserId(userId) {
    return new Promise((resolve, reject) => {
        fetch(prefix + "/rentals/" + userId)
            .then(res => {
                if (res.status === 404)
                    reject(`No rental for user with id=${userId} found`);
                else if (res.status === 401)
                    reject("Authentication error");
                else if (res.ok)
                    res.json()
                        .then(json => resolve(json.map(rental => Rental.from(rental))))
                        .catch(err => reject("Server error"));
                else
                    reject("Server error");
            })
            .catch(err => reject("Server unavailable"));
    });
}

// Payment related APIs

async function pay(details) {
    return new Promise((resolve, reject) => {
        const {fullName, cardNumber, CVV, amount} = details;
        fetch(prefix + "/payment",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    fullName: fullName,
                    cardNumber: cardNumber,
                    CVV: CVV,
                    amount: amount,
                })
            })
            .then(res => {
                if (res.status === 401)
                    reject("Authentication error");
                else if (res.status === 400)
                    reject(res.body.errors)
                else if (res.ok)
                    resolve(null)
                else
                    reject("Server error");
            })
            .catch(err => reject("Server unavailable"));
    });
}

const API = {isLoggedIn, login, logout, getAllCars, getCarById, toggleCanceledByRentalId, getRentalsByUserId, pay};
export default API;