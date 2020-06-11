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

