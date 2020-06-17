const rentalDao = require("../dao/rental_dao");
const carDao = require("../dao/car_dao");
const moment = require("moment");

exports.priceCheck = async (amount, rental) => {
    const rentals = await rentalDao.getRentals();
    const cars = await carDao.getCars();

    const startingDayDate = moment(rental.startingDay);
    const endDayDate = moment(rental.endDay);

    let durationMultiplier;
    let categoryMultiplier;
    let kmPerDayMultiplier;
    let driversAgeMultiplier;
    let extraDriversMultiplier;
    let insuranceMultiplier;
    let fewCategoryVehiclesRemainingMultiplier;
    let frequentCustomerMultiplier;

    durationMultiplier = endDayDate.diff(startingDayDate, "days") + 1;

    switch (rental.carCategory) {
        case "A":
            categoryMultiplier = 80;
            break;
        case "B":
            categoryMultiplier = 70;
            break;
        case "C":
            categoryMultiplier = 60;
            break;
        case "D":
            categoryMultiplier = 50;
            break;
        case "E":
            categoryMultiplier = 40;
            break;
        default:
            console.error("Unexpected category in utils/price_checker");
            break;
    }

    switch (rental.estimatedKilometers) {
        case "less than 50 km":
            kmPerDayMultiplier = -0.05;
            break;
        case "between 50 and 150 km":
            kmPerDayMultiplier = 0;
            break;
        case "over 150 km":
            kmPerDayMultiplier = 0.05;
            break;
        default:
            console.error("Unexpected kmPerDay in utils/price_checker");
            break;
    }

    switch (rental.driversAge) {
        case "under 25":
            driversAgeMultiplier = 0.05;
            break;
        case "between 26 and 64":
            driversAgeMultiplier = 0;
            break;
        case "over 65":
            driversAgeMultiplier = 0.10;
            break;
        default:
            console.error("Unexpected driversAge in utils/price_checker");
            break;
    }

    extraDriversMultiplier = rental.extraDrivers ? 0.15 : 0;
    insuranceMultiplier = rental.insurance ? 0.20 : 0;

    const categoryCars = cars.filter(car => car.category === rental.carCategory);
    const freeCarIdsInSelectedPeriod = categoryCars.map(car => car.id);
    // set freeCarIdsInSelectedPeriod
    rentals
        .filter(r => r.carCategory === rental.carCategory)
        .filter(r => !r.canceled)
        .forEach(r => {
            // if this rental overlaps with the selected time period, remove the corresponding carId from freeCarIdsInSelectedPeriod
            if (!(moment(r.endDay).isBefore(startingDayDate) || moment(r.startingDay).isAfter(endDayDate)))
                freeCarIdsInSelectedPeriod.splice(freeCarIdsInSelectedPeriod.indexOf(r.carId, 1));
        });
    fewCategoryVehiclesRemainingMultiplier = freeCarIdsInSelectedPeriod.length < (0.1 * categoryCars.length) ? 0.10 : 0;

    frequentCustomerMultiplier = rentals
        .filter(r => r.userId === rental.userId)
        .filter(r => !r.canceled)
        .filter(r => moment(r.endDay).isBefore(moment()))
        .length >= 3 ? -0.10 : 0;

    return amount ===
        categoryMultiplier *
        durationMultiplier *
        (1 + (kmPerDayMultiplier +
            driversAgeMultiplier +
            extraDriversMultiplier +
            insuranceMultiplier +
            fewCategoryVehiclesRemainingMultiplier +
            frequentCustomerMultiplier));
}
