// const moment = require("moment");

class Rental {
    constructor(
        id,
        carId,
        userId,
        startingDay,
        endDay,
        carCategory,
        driversAge,
        driversAgeSpecific,
        extraDrivers,
        extraDriversSpecific,
        estimatedKilometers,
        insurance,
        canceled,
        amount
        ) {
        this.id = id;
        this.carId = carId;
        this.userId = userId;
        this.startingDay = startingDay; // moment(startingDay);
        this.endDay = endDay; // moment(endDay);
        this.carCategory = carCategory;
        this.driversAge = driversAge;
        this.driversAgeSpecific = driversAgeSpecific;
        this.extraDrivers = extraDrivers;
        this.extraDriversSpecific = extraDriversSpecific;
        this.estimatedKilometers = estimatedKilometers;
        this.insurance = insurance;
        this.canceled = canceled;
        this.amount = amount;
    }
}

module.exports = Rental;