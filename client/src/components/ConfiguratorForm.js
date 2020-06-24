import React, {useContext, useEffect, useState} from "react";
import {Redirect, useHistory} from "react-router-dom";
import {Alert, Button, Col, Container, Form, Jumbotron, Row} from "react-bootstrap";
import moment from "moment";

import {AuthContext} from "../auth/AuthContext";
import API from "../api/API";
import {driversAgeLUT, kmPerDayLUT} from "../utils/luts";


const ConfiguratorForm = props => {

    // context variables
    const {authUser, handleAuthorizationError, rental, setRental} = useContext(AuthContext);

    // to navigate to /payment
    const {push} = useHistory();

    // state variables
    const [rentals, setRentals] = useState([]);
    // set to previous rental data if coming back from payment
    const [category, setCategory] = useState((rental && rental.carCategory) || "");
    const [startingDay, setStartingDay] = useState((rental && rental.startingDay) || "");
    const [endDay, setEndDay] = useState((rental && rental.endDay) || "");
    const [driversAge, setDriversAge] = useState((rental && rental.driversAge) || "");
    const [driversAgeSpecific, setDriversAgeSpecific] = useState((rental && rental.driversAgeSpecific) || "18");
    const [kmPerDay, setKmPerDay] = useState((rental && rental.estimatedKilometers) || "");
    const [extraDrivers, setExtraDrivers] = useState((rental && rental.extraDrivers) || false);
    const [extraDriversSpecific, setExtraDriversSpecific] = useState((rental && rental.extraDriversSpecific) || "0");
    const [insurance, setInsurance] = useState((rental && rental.insurance) || false);

    // output variables
    const [userErrors, setUserErrors] = useState([]);
    const [driversAgeMsg, setDriversAgeMsg] = useState("");
    const [amount, setAmount] = useState((rental && +rental.amount) || -1);
    const [availableCars, setAvailableCars] = useState((rental && rental.availableCars) || -1);
    const [car, setCar] = useState((rental && rental.car) || null);

    // load rentals at componentDidMount
    useEffect(() => {
        API.getAllRentals()
            .then(rentals => setRentals(rentals))
            .catch(err => {
                handleAuthorizationError(err);
                console.error(err);
            });
    }, []);

    const handleChange = event => {
        // clone state variables to immediately show relevant errors and output
        let categoryTmp = category;
        let startingDayTmp = startingDay;
        let endDayTmp = endDay;
        let driversAgeSpecificTmp = driversAgeSpecific;
        let kmPerDayTmp = kmPerDay;
        let extraDriversSpecificTmp = extraDriversSpecific;
        let insuranceTmp = insurance;

        // update variable which triggered change both locally and in state
        const t = event.target;
        switch (t.id) {
            case "form-category":
                setCategory(t.value);
                categoryTmp = t.value;
                break;
            case "form-startingday":
                setStartingDay(t.value);
                startingDayTmp = t.value;
                break;
            case "form-endday":
                setEndDay(t.value);
                endDayTmp = t.value;
                break;
            case "form-driversage":
                setDriversAgeSpecific(t.value);
                driversAgeSpecificTmp = t.value;
                break;
            case "form-kmperday":
                setKmPerDay(t.value);
                kmPerDayTmp = t.value;
                break;
            case "form-extradrivers":
                setExtraDriversSpecific(t.value);
                extraDriversSpecificTmp = t.value;
                break;
            case "form-insurance":
                setInsurance(t.checked);
                insuranceTmp = t.checked;
                break;
            default:
                console.error("Unexpected event.target.id in ConfiguratorForm.handleChange");
                break;
        }

        // check for user errors
        let userErrorsTmp = [];
        const startingDayDate = moment(startingDayTmp, "YYYY-MM-DD");
        const endDayDate = moment(endDayTmp, "YYYY-MM-DD");
        if (endDayDate.isBefore(startingDayDate))
            userErrorsTmp.push("The last day should coincide with or come after the first day. " +
                               "Please fix your date selection.");
        if (startingDayDate.isBefore(moment()))
            userErrorsTmp.push("The first day cannot be in the past. Please set the first day in the future.");
        if (driversAgeSpecificTmp !== "") {
            if (isNaN(driversAgeSpecificTmp))
                userErrorsTmp.push("The driver's age should be a number.")
            else {
                if (driversAgeSpecificTmp < 18 || driversAgeSpecificTmp > 100)
                    userErrorsTmp.push("The driver's age should be a positive number greater than 18 and smaller than 100.")
                if (driversAgeSpecificTmp.indexOf('.') !== -1 || driversAgeSpecificTmp.indexOf(',') !== -1)
                    userErrorsTmp.push("The driver's age should be an integer number.")
            }
        }
        if (extraDriversSpecificTmp !== "") {
            if (isNaN(extraDriversSpecificTmp))
                userErrorsTmp.push("The extra drivers fields should contain a number.")
            else {
                if (extraDriversSpecificTmp < 0 || extraDriversSpecificTmp > 5)
                    userErrorsTmp.push("The extra drivers field should be a positive number smaller than 5.")
                if (extraDriversSpecificTmp.indexOf('.') !== -1 || extraDriversSpecificTmp.indexOf(',') !== -1)
                    userErrorsTmp.push("The extra drivers field should be an integer number.")
            }
        }

        // show errors
        setUserErrors(userErrorsTmp);
        // calculate and show price
        if (userErrorsTmp.length === 0) {
            if ( // if all inputs are set
                categoryTmp !== "" &&
                startingDayTmp !== "" &&
                endDayTmp !== "" &&
                driversAgeSpecificTmp !== "" &&
                extraDriversSpecificTmp !== "" &&
                kmPerDayTmp !== ""
            ) {
                let durationMultiplier;
                let categoryMultiplier;
                let kmPerDayMultiplier;
                let driversAgeMultiplier;
                let extraDriversMultiplier;
                let insuranceMultiplier;
                let fewCategoryVehiclesRemainingMultiplier;
                let frequentCustomerMultiplier;

                durationMultiplier = endDayDate.diff(startingDayDate, "days") + 1;

                switch (categoryTmp) {
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
                        console.error("Unexpected category in ConfiguratorForm.handleChange");
                        break;
                }

                switch (kmPerDayTmp) {
                    case kmPerDayLUT.under50:
                        kmPerDayMultiplier = -0.05;
                        break;
                    case kmPerDayLUT.between50and150:
                        kmPerDayMultiplier = 0;
                        break;
                    case kmPerDayLUT.over150:
                        kmPerDayMultiplier = 0.05;
                        break;
                    default:
                        console.error("Unexpected kmPerDay in ConfiguratorForm.handleChange");
                        break;
                }

                if (driversAgeSpecificTmp < 25) {
                    setDriversAge(0);
                    setDriversAgeMsg(driversAgeLUT.under25);
                    driversAgeMultiplier = 0.05;
                }
                else if (driversAgeSpecificTmp >= 25 && driversAgeSpecificTmp <= 65) {
                    setDriversAge(1);
                    setDriversAgeMsg(driversAgeLUT.between26and64);
                    driversAgeMultiplier = 0;
                }
                else if (driversAgeSpecificTmp > 65) {
                    setDriversAge(2);
                    setDriversAgeMsg(driversAgeLUT.over65);
                    driversAgeMultiplier = 0.10;
                }
                else console.error("Unexpected driversAgeSpecific in ConfiguratorForm.handleChange");
                setDriversAgeSpecific(driversAgeSpecificTmp)

                setExtraDrivers(extraDriversSpecificTmp > 0 ? 1 : 0);

                extraDriversMultiplier = extraDriversSpecificTmp > 0 ? 0.15 : 0;
                insuranceMultiplier = insuranceTmp ? 0.20 : 0;

                const categoryCars = props.cars.filter(car => car.category === categoryTmp);
                const freeCarIdsInSelectedPeriod = categoryCars.map(car => car.id);
                // set freeCarIdsInSelectedPeriod
                rentals
                    .filter(r => r.carCategory === categoryTmp)
                    .filter(r => !r.canceled)
                    .forEach(r => {
                        // if this rental overlaps with the selected time period, remove the corresponding carId from freeCarIdsInSelectedPeriod
                        if (!(moment(r.endDay).isBefore(startingDayDate) || moment(r.startingDay).isAfter(endDayDate)))
                            freeCarIdsInSelectedPeriod.splice(freeCarIdsInSelectedPeriod.indexOf(r.carId, 1));
                    });
                fewCategoryVehiclesRemainingMultiplier = freeCarIdsInSelectedPeriod.length < (0.1 * categoryCars.length) ? 0.10 : 0;
                setAvailableCars(freeCarIdsInSelectedPeriod.length);

                frequentCustomerMultiplier = rentals
                    .filter(r => r.userId === authUser.id)
                    .filter(r => !r.canceled)
                    .filter(r => moment(r.endDay).isBefore(moment()))
                    .length >= 3 ? -0.10 : 0;

                const debugLog = () => {
                    console.log()  // separate info blocks
                    console.log("Duration: " + durationMultiplier + " days")
                    console.log("Category: " + categoryTmp, "Multi: " + categoryMultiplier)
                    console.log("Cars of that category: " + categoryCars.length)
                    console.log("KmPerDay: " + kmPerDayTmp, "Multi: " + kmPerDayMultiplier)
                    console.log("Age: " + driversAgeSpecificTmp, "Multi: " + driversAgeMultiplier)
                    console.log("Extra drivers: " + extraDriversSpecificTmp, "Multi: " + extraDriversMultiplier)
                    console.log("Insurance: " + insuranceTmp, "Multi: " + insuranceMultiplier)
                    console.log("Vehicles: " + freeCarIdsInSelectedPeriod || "none", "Multi: " + fewCategoryVehiclesRemainingMultiplier)
                    console.log("Frequent: " + frequentCustomerMultiplier)
                    console.log("Price without multi: " + durationMultiplier * categoryMultiplier)
                    console.log("Final multi: " + (1 + kmPerDayMultiplier + driversAgeMultiplier + extraDriversMultiplier + insuranceMultiplier + fewCategoryVehiclesRemainingMultiplier + frequentCustomerMultiplier))
                }
                // debugLog();

                // at least 1 car available
                if (freeCarIdsInSelectedPeriod.length > 0) {
                    setCar(categoryCars.filter(c => freeCarIdsInSelectedPeriod.includes(c.id))[0]);
                    setAmount(
                        categoryMultiplier *
                        durationMultiplier *
                        (1 + (kmPerDayMultiplier +
                            driversAgeMultiplier +
                            extraDriversMultiplier +
                            insuranceMultiplier +
                            fewCategoryVehiclesRemainingMultiplier +
                            frequentCustomerMultiplier))
                    );
                } else {  // no car remaining in the selected period
                    userErrorsTmp.push("No available cars of selected category in selected time period. " +
                        "Please change either category or rental period.")
                    setUserErrors(userErrorsTmp);
                }
            }
        }
    }

    return (
        !authUser ?
        <Redirect to={"/"} /> :
        <div id={"ConfiguratorForm"}>
            <Jumbotron id={"jumbotron-configuratorform"}>
                <h1>configure</h1>
            </Jumbotron>
            <Container className={"d-flex justify-content-center"}>
                <Col xs={12}>
                    <Form
                        method={"POST"}
                        onChange={handleChange}
                    >
                                <Row>
                                    <Col>
                                        <Form.Group controlId={"form-category"}>
                                            <Form.Label>Car category:</Form.Label>
                                            <Form.Control
                                                as={"select"}
                                                value={category}
                                                required
                                            >
                                                <option selected disabled value={""}>Select category</option>
                                                <option>A</option>
                                                <option>B</option>
                                                <option>C</option>
                                                <option>D</option>
                                                <option>E</option>
                                            </Form.Control>
                                            <Form.Text className={"text-muted"}>
                                                A for maximum luxury, E for minimum spendings
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId={"form-kmperday"}>
                                            <Form.Label>Estimated kilometers per day:</Form.Label>
                                            <Form.Control
                                                as={"select"}
                                                value={kmPerDay}
                                            >
                                                <option selected disabled value={""}>Select kilometers range</option>
                                                <option>{kmPerDayLUT.under50}</option>
                                                <option>{kmPerDayLUT.between50and150}</option>
                                                <option>{kmPerDayLUT.over150}</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group controlId={"form-startingday"}>
                                            <Form.Label>From day:</Form.Label>
                                            <Form.Control
                                                type={"date"}
                                                value={startingDay}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId={"form-endday"}>
                                            <Form.Label>Until day:</Form.Label>
                                            <Form.Control
                                                type={"date"}
                                                value={endDay}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group controlId={"form-driversage"}>
                                            <Form.Label>Driver's age:</Form.Label>
                                            <Form.Control
                                                type={"number"}
                                                value={driversAgeSpecific}
                                                placeholder={"Enter a number"}
                                                required
                                            />
                                            {/*driversAgeMsg && <Form.Text className={"text-muted"}>{driversAgeMsg}</Form.Text>*/}
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId={"form-extradrivers"}>
                                            <Form.Label>Number of extra drivers:</Form.Label>
                                            <Form.Control
                                                type={"number"}
                                                value={extraDriversSpecific}
                                                placeholder={"Enter a number"}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className={"justify-content-center"}>
                                    <Form.Check
                                        id={"form-insurance"}
                                        type={"checkbox"}
                                        label={"Additional insurance"}
                                        checked={insurance}
                                        className={"mb-3"}
                                    />
                                </Row>

                    </Form>
                    {userErrors.length > 0 &&
                    userErrors.map((err, idx) => <Alert key={idx} variant={"danger"}>{err}</Alert>)
                    }
                    {userErrors.length === 0 && amount === -1 &&
                    <Alert variant={"warning"}>
                        Please enter all the required information to see our solution for you.
                    </Alert>
                    }
                    {userErrors.length === 0 && amount !== -1 &&
                    <div id={"calculated-price"}>
                        <Alert variant={"info"} className={"text-center"}>
                            Number of available cars in selected period: {availableCars}
                            {" | "}Your rental's price: {amount
                            .toLocaleString(
                                "it-IT",
                                {style: "currency", currency: "EUR"})}
                        </Alert>
                        <Container className={"d-flex justify-content-center"}>
                            <Col xs={5}>
                                <Button variant={"primary"} block onClick={
                                    () => {
                                        setRental({
                                            startingDay,
                                            endDay,
                                            carCategory: category,
                                            driversAge,
                                            driversAgeSpecific,
                                            extraDrivers,
                                            extraDriversSpecific,
                                            estimatedKilometers: kmPerDay,
                                            insurance,
                                            car,  // to maintain carId and carCategory
                                            availableCars,
                                            carId: car.id,
                                            userId: authUser.id,
                                            canceled: false,
                                            amount: amount.toFixed(2),
                                        });
                                        push("/payment");
                                    }}>
                                    Rent!
                                </Button>
                            </Col>
                        </Container>
                    </div>
                    }
                </Col>
            </Container>
        </div>
    );
}

export default ConfiguratorForm;