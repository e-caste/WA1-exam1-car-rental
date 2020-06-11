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
        insurance,
        canceled,
        amount
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
        this.canceled = canceled;
        this.amount = amount;
    }

    static from(json) {
        return  Object.assign(new Rental(), json);
    }
}

export default Rental;