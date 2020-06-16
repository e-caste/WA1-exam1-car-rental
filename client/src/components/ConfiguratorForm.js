import React, {useContext, useEffect, useState} from "react";
import {Redirect, Link} from "react-router-dom";
import {Alert, Button, Col, Form, Jumbotron, Row} from "react-bootstrap";
import moment from "moment";

import {AuthContext} from "../auth/AuthContext";
import API from "../api/API";

const ConfiguratorForm = props => {

    // context variables
    const {authUser, rental, setRental} = useContext(AuthContext);

    // state variables
    // set to previous rental data if coming back from payment
    const [category, setCategory] = useState(rental && rental.category || "");
    const [startingDay, setStartingDay] = useState(rental && rental.startingDay || "");
    const [endDay, setEndDay] = useState(rental && rental.endDay || "");
    const [driversAge, setDriversAge] = useState(rental && rental.driversAge || "");
    const [kmPerDay, setKmPerDay] = useState(rental && rental.kmPerDay || "");
    const [extraDrivers, setExtraDrivers] = useState(rental && rental.extraDrivers || false);
    const [insurance, setInsurance] = useState(rental && rental.insurance || false);

    // output variables
    const [userErrors, setUserErrors] = useState([]);
    const [amount, setAmount] = useState(rental && rental.amount || -1);
    const [car, setCar] = useState(null);

    const handleChange = async event => {
        // clone state variables to immediately show relevant errors
        let categoryTmp = category;
        let startingDayTmp = startingDay;
        let endDayTmp = endDay;
        let driversAgeTmp = driversAge;
        let kmPerDayTmp = kmPerDay;
        let extraDriversTmp = extraDrivers;
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
                setDriversAge(t.value);
                driversAgeTmp = t.value;
                break;
            case "form-kmperday":
                setKmPerDay(t.value);
                kmPerDayTmp = t.value;
                break;
            case "form-extradrivers":
                setExtraDrivers(t.checked);
                extraDriversTmp = t.checked;
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

        // show errors
        setUserErrors(userErrorsTmp);
        if (userErrorsTmp.length === 0) {  // calculate and show price
            if ( // if all inputs are set
                categoryTmp !== "" &&
                startingDayTmp !== "" &&
                endDayTmp !== "" &&
                driversAgeTmp !== "" &&
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
                    case "less than 50 km":
                        kmPerDayMultiplier = 0.95;
                        break;
                    case "between 50 and 150 km":
                        kmPerDayMultiplier = 1.0;
                        break;
                    case "over 150 km":
                        kmPerDayMultiplier = 1.05;
                        break;
                    default:
                        console.error("Unexpected kmPerDay in ConfiguratorForm.handleChange");
                        break;
                }

                switch (driversAgeTmp) {
                    case "under 25":
                        driversAgeMultiplier = 1.05;
                        break;
                    case "between 26 and 64":
                        driversAgeMultiplier = 1.0;
                        break;
                    case "over 65":
                        driversAgeMultiplier = 1.10;
                        break;
                    default:
                        console.error("Unexpected driversAge in ConfiguratorForm.handleChange");
                        break;
                }

                extraDriversMultiplier = extraDriversTmp ? 1.15 : 1.0;
                insuranceMultiplier = insuranceTmp ? 1.20 : 1.0;

                // TODO: set based on cars and rentals - use fetch
                const cars = props.cars.filter(car => car.category === categoryTmp);
                const rentals = await API.getAllRentals();
                console.log(cars, rentals)
                fewCategoryVehiclesRemainingMultiplier = 1.0;

                const userRentals = await API.getRentalsByUserId(authUser.id);
                frequentCustomerMultiplier = userRentals.length >= 3 ? 0.90 : 1.0;

                setAmount(
                    categoryMultiplier *
                    durationMultiplier *
                    ((kmPerDayMultiplier +
                    driversAgeMultiplier +
                    extraDriversMultiplier +
                    insuranceMultiplier +
                    fewCategoryVehiclesRemainingMultiplier +
                    frequentCustomerMultiplier) / 6)
                );
            }
        }
    }

    return (
        !authUser ?
        <Redirect to={"/"} /> :
        <div id={"ConfiguratorForm"}>
            <Jumbotron>
                <h1>Configure</h1>
            </Jumbotron>
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
                        <Form.Group>
                            <Form.Label className={"mb-3"}>Options:</Form.Label>
                            <div className={"inline-checkbox"}>
                                <Form.Check
                                    id={"form-extradrivers"}
                                    type={"checkbox"}
                                    label={"More than one driver"}
                                    checked={extraDrivers}
                                    inline
                                />
                                <Form.Check
                                    id={"form-insurance"}
                                    type={"checkbox"}
                                    label={"Additional insurance"}
                                    checked={insurance}
                                    inline
                                />
                            </div>
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
                                as={"select"}
                                value={driversAge}
                            >
                                <option selected disabled value={""}>Select age range</option>
                                <option>under 25</option>
                                <option>between 26 and 64</option>
                                <option>over 65</option>
                            </Form.Control>
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
                                <option>less than 50 km</option>
                                <option>between 50 and 150 km</option>
                                <option>over 150 km</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            {userErrors.length > 0 &&
                userErrors.map(err => <Alert variant={"danger"}>{err}</Alert>)
            }
            {userErrors.length === 0 && amount !== -1 &&
                <div id={"calculated-price"}>
                    <Row className={"mt-3"}>
                        <Col />
                        <Col>
                            <Alert variant={"info"}>Your rental's price: {amount
                                .toLocaleString(
                                    "it-IT",
                                    {style: "currency", currency: "EUR"})}
                            </Alert>
                            <Button variant={"outline-primary"} block onClick={
                                () => setRental({
                                    startingDay,
                                    endDay,
                                    category,
                                    driversAge,
                                    extraDrivers,
                                    kmPerDay,
                                    insurance,
                                    // carId: car.id,
                                    userId: authUser.id,
                                    canceled: false,
                                    amount
                            })}>
                                <Link to={"/payment"}>Rent!</Link>
                            </Button>
                        </Col>
                        <Col />
                    </Row>
                </div>
            }
        </div>
    );
}

export default ConfiguratorForm;