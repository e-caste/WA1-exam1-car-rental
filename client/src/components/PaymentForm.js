import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../auth/AuthContext";
import {Alert, Button, Col, Container, Form, Jumbotron, Row} from "react-bootstrap";
import API from "../api/API";
import {Redirect, useHistory} from "react-router-dom";

const PaymentForm = props => {

    // context variables
    const {authUser, rental, setRental, details, setDetails, handleAuthorizationError} = useContext(AuthContext);

    // to navigate back to /rent
    const {push} = useHistory();

    // state variables
    const [name, setName] = useState((details && details.name) || "");
    const [surname, setSurname] = useState((details && details.surname ) || "");
    const [creditCard, setCreditCard] = useState((details && details.creditCard) || "");
    const [cvv, setCvv] = useState((details && details.cvv) || "");

    const [userErrors, setUserErrors] = useState([]);
    const [apiErrors, setApiErrors] = useState([]);
    const [paymentSuccessful, setPaymentSuccessful] = useState(null);
    const [saveSuccessful, setSaveSuccessful] = useState(null);

    // redirect to /login if cookie expired
    useEffect(() => {
        API.isLoggedIn()
            .catch(err => handleAuthorizationError(err));
    }, []);

    const handleChange = event => {
        // clone state variable to immediately show relevant errors
        let nameTmp = name;
        let surnameTmp = surname;
        let creditCardTmp = creditCard;
        let cvvTmp = cvv;

        const t = event.target;
        switch (t.id) {
            case "form-name":
                setName(t.value);
                nameTmp = t.value;
                break;
            case "form-surname":
                setSurname(t.value);
                surnameTmp = t.value;
                break;
            case "form-creditcard":
                setCreditCard(t.value);
                creditCardTmp = t.value;
                break;
            case "form-cvv":
                setCvv(t.value);
                cvvTmp = t.value;
                break;
            default:
                console.error("Unexpected id in PaymentForm.handleChange");
                break;
        }

        if (formFilled()) {
            let userErrorsTmp = [];
            if (nameTmp === "")
                userErrorsTmp.push("Please enter your name.")
            if (surnameTmp === "")
                userErrorsTmp.push("Please enter your surname.")
            if (creditCardTmp.length !== 16)
                userErrorsTmp.push("Please make sure that your credit card number contains all the 16 digits.")
            if (isNaN(creditCardTmp))
                userErrorsTmp.push("Please enter a valid number in the credit card field.")
            if (cvvTmp.length !== 3)
                userErrorsTmp.push("Please make sure that your CVV number contains all the 3 digits.")
            if (isNaN(cvvTmp))
                userErrorsTmp.push("Please enter a valid number in the CVV field.")
            setUserErrors(userErrorsTmp);
        }

        setDetails({
            name: nameTmp,
            surname: surnameTmp,
            creditCard: creditCardTmp,
            cvv: cvvTmp,
        });
    }

    const formFilled = () =>
            name !== "" &&
            surname !== "" &&
            creditCard !== "" &&
            cvv !== "";

    const formValidated = () =>
        formFilled() &&
        name.length > 0 &&
        surname.length > 0 &&
        creditCard.length === 16 &&
        !isNaN(creditCard) &&
        cvv.length === 3 &&
        !isNaN(cvv);

    const handleSubmit = async event => {
        event.preventDefault();
        let apiErrorsTmp = [];
        let paymentSuccessfulTmp = false;
        let saveSuccessfulTmp = false;

        // do payment
        // use +number to convert string to number
        try {
            const payRes = await API.pay({
                details: {
                    fullName: `${name.trim()} ${surname.trim()}`,
                    cardNumber: +creditCard,
                    CVV: +cvv,
                    amount: +rental.amount,
                },
                rental: {
                    startingDay: rental.startingDay,
                    endDay: rental.endDay,
                    carCategory: rental.carCategory,
                    driversAge: rental.driversAge,
                    extraDrivers: rental.extraDrivers,
                    estimatedKilometers: rental.estimatedKilometers,
                    insurance: rental.insurance,
                    userId: rental.userId,
                }
        });
            paymentSuccessfulTmp = payRes === null;
        } catch (err) {
            apiErrorsTmp.push("There was an issue with your payment. Please try again.");
            handleAuthorizationError(err);
            console.error(err);
        }

        // save rental in database
        try {
            const saveRes = await API.saveRental(rental);
            const saveJson = await saveRes.json();
            saveSuccessfulTmp = saveJson && saveJson.id && !isNaN(saveJson.id);  // id of the newly added rental
        } catch (err) {
            apiErrorsTmp.push("There was an issue while making your reservation. Please try again.");
            handleAuthorizationError(err);
            console.error(err);
        }

        setApiErrors(apiErrorsTmp);
        setPaymentSuccessful(paymentSuccessfulTmp);
        setSaveSuccessful(saveSuccessfulTmp);
        if (paymentSuccessfulTmp && saveSuccessfulTmp)
            setRental(null);
            setDetails(null);
    }

    return (
        !authUser ?
        <Redirect to={"/"} /> :
        <div id={"PaymentForm"}>
            <Jumbotron id={"jumbotron-paymentform"}>
                <h1>rent</h1>
            </Jumbotron>
            <Container className={"d-flex justify-content-center"}>
                <Col xs={12}>
                    <Form
                        method={"POST"}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                    >
                        <Form.Label>Please enter your credit card information:</Form.Label>
                        <Form.Row className={"mb-3"}>
                            <Col>
                                <Form.Control
                                    id={"form-name"}
                                    type={"text"}
                                    placeholder={"Your name"}
                                    value={name}
                                    required
                                    autoFocus
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    id={"form-surname"}
                                    type={"text"}
                                    placeholder={"Your surname"}
                                    value={surname}
                                    required
                                />
                            </Col>
                        </Form.Row>
                        <Form.Row className={"mb-3"}>
                            <Col>
                                <Form.Control
                                    id={"form-creditcard"}
                                    type={"creditcard"}
                                    placeholder={"Your credit card number"}
                                    value={creditCard}
                                    required
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    id={"form-cvv"}
                                    type={"text"}
                                    placeholder={"CVV"}
                                    value={cvv}
                                    required
                                />
                            </Col>
                        </Form.Row>
                        <Row>
                            <Col>
                                <Button
                                    variant={"outline-secondary"}
                                    onClick={() => push("/rent")}
                                    block
                                >
                                    Back to configurator
                                </Button>
                            </Col>
                            {formValidated() && userErrors.length === 0 ?
                            <Col>
                                <Button
                                    type={"submit"}
                                    variant={"primary"}
                                    block
                                >
                                    Pay now
                                </Button>
                            </Col> :
                            <Col />
                            }
                        </Row>
                        {userErrors.length > 0 &&
                            <div className={"mt-4"}>
                                {userErrors.map((err, idx) => <Alert key={idx} variant={"danger"}>{err}</Alert>)}
                            </div>
                        }
                    </Form>
                    {paymentSuccessful !== null && saveSuccessful !== null && (
                        paymentSuccessful && saveSuccessful ?
                        <Redirect to={"/rentals"} /> :
                        <div className={"mt-4"}>
                            {apiErrors.map((err, idx) => <Alert key={idx} variant={"danger"} className={"mt-4"}>{err}</Alert>)}
                        </div>
                    )}
                </Col>
            </Container>
        </div>
    );
}

export default PaymentForm;