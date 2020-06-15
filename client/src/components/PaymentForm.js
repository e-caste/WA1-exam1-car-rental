import React, {useContext, useState} from "react";
import {AuthContext} from "../auth/AuthContext";
import {Alert, Button, Col, Form, Jumbotron, Row} from "react-bootstrap";
import API from "../api/API";
import {Redirect} from "react-router-dom";

const PaymentForm = props => {

    // state variables
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [creditCard, setCreditCard] = useState("");
    const [cvv, setCvv] = useState("");

    const [userErrors, setUserErrors] = useState([]);
    const [rentalSuccessful, setRentalSuccessful] = useState(null);

    // context variables
    const {authUser, rental} = useContext(AuthContext);

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

    const handleSubmit = event => {
        event.preventDefault();
        // do payment
        // use +number to convert string to number
        const paymentSuccessful = API.pay({
            fullName: `${name} ${surname}`,
            cardNumber: +creditCard,
            CVV: +cvv,
            amount: rental.amount,
        })
            .catch(err => -1)
        === null;

        // save rental in database
        const saveSuccessful = API.saveRental(rental)
            .then(res => {
                res.json()
                    .then(json => json.id)
            })
            .catch(err => -1)
        === authUser.id;

        setRentalSuccessful(paymentSuccessful && saveSuccessful);
    }

    return (
        // TODO: add authUser check
        // !authUser ?
        // <Redirect to={"/"} /> :
        <div id={"PaymentForm"}>
            <Jumbotron>
                <h1>Rent</h1>
            </Jumbotron>
            <Form
                method={"POST"}
                onChange={handleChange}
                onSubmit={handleSubmit}
                className={"ml-10 mr-10"}
            >
                <Form.Label>Please enter your credit card information</Form.Label>
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
                <Button
                    href={"/rent"}
                    variant={"secondary"}
                    className={"mr-3"}
                >
                    Back to configurator
                </Button>
                {formValidated() && userErrors.length === 0 &&
                <Button
                    type={"submit"}
                    variant={"primary"}
                >
                    Pay now
                </Button>
                }
                {userErrors.length > 0 &&
                    <div className={"mt-4"}>
                        {userErrors.map(err => <Alert variant={"danger"}>{err}</Alert>)}
                    </div>
                }
            </Form>
            {rentalSuccessful !== null && (
                rentalSuccessful ?
                <Redirect to={"/rentals"} /> :
                <Alert variant={"danger"} className={"mt-4"}>There was a problem submitting your payment. Please try again.</Alert>
            )}
        </div>
    );
}

export default PaymentForm;