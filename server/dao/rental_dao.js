'use strict';

const db = require("../db");
const Rental = require("../entities/rental");

const createRental = row => new Rental(row.id, row.carid, row.userid,  // ids to join tables
                                       row.startingday, row.endday,   // dates
                                       row.carcategory, row.driversage, row.driversagespecific, row.extradrivers, row.extradriversspecific, row.estimatedkilometers, row.insurance,  // price influencers
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

exports.saveRental = function (rental) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO " +
            "RENTALS ('id', 'startingday', 'endday', 'carcategory', 'driversage', 'driversagespecific', 'extradrivers', 'extradriversspecific', 'estimatedkilometers', 'insurance', 'carid', 'userid', 'canceled', 'amount') " +
            "VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const {
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
        db.run(sql, [
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
            0,
            amount,
        ], function (err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
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

exports.getRentals = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM RENTALS";
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else
                resolve(rows.map(r => createRental(r)));
        });
    });
}
