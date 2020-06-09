'use strict';

exports.pay = function (details) {
    return new Promise((resolve, reject) => {
        const {fullName, cardNumber, CVV, amount} = details;
        // do some basic validation
        if (fullName && cardNumber && CVV && amount &&
            typeof fullName === "string" && typeof cardNumber === "number" && typeof CVV === "number" && typeof amount === "number" &&
            cardNumber.toString().length === 16 && CVV.toString().length === 3) {
            resolve(null);
        }
        reject("Missing payment details.");
    });
}