import Car from "../entities/Car";
import Rental from "../entities/Rental";

const prefix = "/api";

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
            .catch(err => reject("Server unavailable"))
    });
}