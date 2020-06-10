'use strict';

const db = require("../db");
const Rental = require("../entities/rental");

const createRental = row => new Rental(row.id, row.carid, row.userid,  // ids to join tables
                                       row.startingday, row.endday,   // dates
                                       row.carcategory, row.driversage, row.extradrivers, row.estimatedkilometers, row.insurance,  // price influencers
                                       row.canceled === 1, row.amount);  // info

exports.toggleCanceled = function (rentalId) {
    return new Promise((resolve, reject) => {
        // use ternary condition with CASE to toggle between 1 and 0 (true and false)
        const sql = "UPDATE RENTALS SET canceled = CASE WHEN canceled = 0 THEN 1 ELSE 0 END WHERE id = ?";
        db.run(sql, [rentalId], (err) => {
            if (err)
                reject(err);
            else
                resolve(null);
        });
    });
}

exports.getRentalsByUserId = function (userId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM RENTALS WHERE userid = ?";
        db.all(sql, [userId], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else
                resolve(rows.map(r => createRental(r)));
        });
    });
}

exports.getRentalsByCarId = function (carId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM RENTALS WHERE carid = ?";
        db.all(sql, [carId], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else
                resolve(rows.map(r => createRental(r)));
        });
    });
}