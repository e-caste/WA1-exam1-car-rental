import React, {useContext, useState} from "react";
import {Redirect} from "react-router-dom";
import {Form, Jumbotron, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import moment from "moment";

import {AuthContext} from "../auth/AuthContext";
import API from "../api/API";

const ConfiguratorForm = props => {

    // state variables
    const [category, setCategory] = useState("");
    const [startingDay, setStartingDay] = useState("");
    const [endDay, setEndDay] = useState("");
    const [driversAge, setDriversAge] = useState("");
    const [kmPerDay, setKmPerDay] = useState("");  // not stored in database
    const [estimatedKilometers, setEstimatedKilometers] = useState(-1);  // = kmPerDay * days
    const [extraDrivers, setExtraDrivers] = useState(false);
    const [insurance, setInsurance] = useState(false);

    // output variables
    const [userErrors, setUserErrors] = useState([]);
    const [amount, setAmount] = useState(-1);

    // context variables
    const {authUser, rental, setRental} = useContext(AuthContext);

    const handleChange = event => {
        const t = event.target;
        switch (t.id) {
            case "form-category":
                setCategory(t.value);
                break;
            case "form-startingday":
                setStartingDay(t.value);
                break;
            case "form-endday":
                setEndDay(t.value);
                break;
            case "form-driversage":
                setDriversAge(t.value);
                break;
            case "form-kmperday":
                setKmPerDay(t.value);
                break;
            case "form-extradrivers":
                setExtraDrivers(t.checked);
                break;
            case "form-insurance":
                setInsurance(t.checked);
                break;
            default:
                console.error("Unexpected event.target.id in ConfiguratorForm.handleChange");
                break;
        }

        // check for user errors
        let userErrorsTmp = [];
        const startingDayDate = moment(startingDay, "YYYY-MM-DD");
        const endDayDate = moment(endDay, "YYYY-MM-DD");
        console.log(startingDayDate, endDayDate, endDayDate.isBefore(startingDayDate))
        if (endDayDate.isBefore(startingDayDate))
            userErrorsTmp.push("The last day should come after the first day. Please fix your date selection.")

        // show errors
        if (userErrorsTmp.length > 0)
            setUserErrors(userErrorsTmp);
        else {  // calculate and show price
            if ( // if all inputs are set
                category !== "" &&
                startingDay !== "" &&
                endDay !== "" &&
                driversAge !== "" &&
                kmPerDay !== ""
            ) {
                let durationMultiplier;
                let categoryMultiplier;
                let kmPerDayMultiplier;
                let driversAgeMultiplier;
                let extraDriversMultiplier;
                let insuranceMultiplier;
                let fewCategoryVehiclesRemainingMultiplier;
                let frequentCustomerMultiplier;

                durationMultiplier = endDayDate.diff(startingDayDate, "days");

                switch (category) {
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

                switch (kmPerDay) {
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

                switch (driversAge) {
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

                extraDriversMultiplier = extraDrivers ? 1.15 : 1.0;
                insuranceMultiplier = insurance ? 1.20 : 1.0;

                // TODO: set based on cars and rentals
                fewCategoryVehiclesRemainingMultiplier = 1.0;

                frequentCustomerMultiplier = API.getRentalsByUserId(1)  // TODO: set to authUser.id
                    .then(rentals => rentals.length) >= 3 ? 0.90 : 1.0;

                setAmount(
                    durationMultiplier *
                    categoryMultiplier *
                    kmPerDayMultiplier *
                    driversAgeMultiplier *
                    extraDriversMultiplier *
                    insuranceMultiplier *
                    fewCategoryVehiclesRemainingMultiplier *
                    frequentCustomerMultiplier
                );
            }
        }
    }

    // configurator must be interactive, hence no submit button
    // const handleSubmit = (event, setRental) => {
    //
    // }

    return (
        // TODO: enable authentication check
        // !authUser ?
        // <Redirect to={"/"} /> :
        <div id={"ConfiguratorForm"}>
            <Jumbotron>
                <h1>Configure</h1>
            </Jumbotron>
            <Form
                method={"POST"}
                onChange={handleChange}
                // onSubmit={event => handleSubmit(event, setRental)}
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
                                <option>less than 50 km</option>
                                <option>between 50 and 150 km</option>
                                <option>over 150 km</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            {userErrors.length > 0 &&
                userErrors.map(err => <h4 className={"text-danger"}>{err}</h4>)
            }
            {userErrors.length === 0 && amount !== -1 &&
                <h4>Your rental's price: {amount}</h4>
            }
        </div>
    );
}

export default ConfiguratorForm;