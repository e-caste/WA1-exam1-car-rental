'use strict';

const bcrypt = require('bcrypt');

const User = require('../entities/user');
const db = require('../db');

// create user from row of USERS table
const createUser = row => new User(row.id, row.name, row.email, row.hash);

// used to search a user in the database when logging in
exports.getUser = function (email) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM USERS WHERE email = ?"
        db.all(sql, [email], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
};

exports.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM USERS WHERE id = ?"
        db.all(sql, [id], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const user = createUser(rows[0]);
                resolve(user);
            }
        });
    });
};

// passwords are created with salt=10 with the following line
// let hash = bcrypt.hashSync(password, 10);
exports.checkPassword = (user, password) => bcrypt.compareSync(password, user.hash);
