import moment from "moment";

class Rental {
    constructor(
        id,
        carId,
        userId,
        startingDay,
        endDay,
        carCategory,
        driversAge,
        extraDrivers,
        estimatedKilometers,
        insurance
        ) {
        this.id = id;
        this.carId = carId;
        this.userId = userId;
        this.startingDay = moment(startingDay);
        this.endDay = moment(endDay);
        this.carCategory = carCategory;
        this.driversAge = driversAge;
        this.extraDrivers = extraDrivers;
        this.estimatedKilometers = estimatedKilometers;
        this.insurance = insurance;
    }
}

module.exports = Rental;