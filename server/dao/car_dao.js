'use strict';

const db = require("../db");
const Car = require("../entities/car");

const createCar = row => new Car(row.id, row.category, row.brand, row.model,  // required
                                row.description, row.kilometers, row.year, row.fuel, // optional
                                row.value, row.kmperlitre, row.passengers, row.stickshift === 1);  // optional

exports.getCars = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM CARS";
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else
                resolve(rows.map(r => createCar(r)));
        });
    });
}

exports.getCar = function (carId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM CARS WHERE id = ?";
        db.all(sql, [carId], (err, rows) => {
            console.log(rows)
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else
                resolve(createCar(rows[0]));
        });
    });
}