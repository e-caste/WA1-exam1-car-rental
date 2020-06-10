'use strict';

const db = require("../db");
const Rental = require("../entities/rental");

const createRental = row => new Rental(row.id, row.carid, row.userid,  // ids to join tables
                                       row.startingday, row.endday,   // dates
                                       row.carcategory, row.driversage, row.extradrivers, row.estimatedkilometers, row.insurance,  // price influencers
                                       row.canceled === 1, row.amount);  // info

exports.toggleCanceled = function (rentalId) {
    return new Promise((resolve, reject) => {
        // get rental if it exists
        let rental;
        let sql = "SELECT * FROM RENTALS WHERE id = ?";
        db.all(sql, [rentalId], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else
                rental = createRental(rows[0]);
        });
        // toggle canceled property and update database
        sql = "UPDATE RENTALS SET canceled = ? WHERE id = ?";
        db.run(sql, [!rental.canceled ? 1 : 0, rentalId], (err) => {
            if (err)
                reject(err);
            else
                resolve(null);  // TODO: check if a different value is needed to verify if function worked
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