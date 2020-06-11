'use strict';

const db = require("../db");
const Rental = require("../entities/rental");

const createRental = row => new Rental(row.id, row.carid, row.userid,  // ids to join tables
                                       row.startingday, row.endday,   // dates
                                       row.carcategory, row.driversage, row.extradrivers, row.estimatedkilometers, row.insurance,  // price influencers
                                       row.canceled === 1, row.amount);  // info

exports.toggleCanceled = function (rentalId, userId) {
    return new Promise((resolve, reject) => {
        // check if the given user has made the rental they attempt to modify, if not resolve to undefined to trigger 404
        let sql = "SELECT * FROM RENTALS WHERE id = ? AND userid = ?";
        db.all(sql, [rentalId, userId], (err, rows) => {
            if (err)
                reject(err);
            if (rows.length === 0)
                resolve(undefined);
        });
        // use ternary condition with CASE to toggle between 1 and 0 (true and false)
        sql = "UPDATE RENTALS SET canceled = CASE WHEN canceled = 0 THEN 1 ELSE 0 END WHERE id = ? AND userid = ?";
        db.run(sql, [rentalId, userId], (err) => {
            if (err)
                reject(err);
            else
                resolve(null);
        });
    });
}

exports.getRentalsById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM RENTALS WHERE userid = ?`;
        db.all(sql, [id], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else
                resolve(rows.map(r => createRental(r)));
        });
    });
}
