'use strict';

const db = require("../db");
const Rental = require("../entities/rental");

const createRental = row => new Rental(row.id, row.carid, row.userid,  // ids to join tables
                                       row.startingday, row.endday,   // dates
                                       row.carcategory, row.driversage, row.extradrivers, row.estimatedkilometers, row.insurance,  // price influencers
                                       row.canceled === 1, row.amount);  // info

exports.toggleCanceled = function (rentalId) {
    return new Promise((resolve, reject) => {
        // TODO: add condition "AND userid = ?" (where to get the current user's id?)
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

exports.getRentalsById = function (id, type) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM RENTALS WHERE ${type}id = ?`;
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
