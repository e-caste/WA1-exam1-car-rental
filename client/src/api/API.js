import Car from "../entities/Car";
import Rental from "../entities/Rental";

const prefix = "/api";

// User related APIs

async function isLoggedIn() {
    const res = await fetch(prefix + "/user");
    const json = await res.json();
    if (res.ok)
        return json;
    throw {status: res.status, message: "Authentication required"};
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
                    res.json().then(user => resolve(user));
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
            .catch(err => reject("Server unavailable"))
    });
}

// Rental related APIs

