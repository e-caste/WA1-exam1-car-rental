import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../auth/AuthContext";
import API from "../api/API";
import {Alert, Button, Jumbotron, Spinner} from "react-bootstrap";
import moment from "moment";
import Rental from "./rentalslist/Rental";
import {Redirect} from "react-router-dom";
import RentalsTable from "./rentalslist/RentalsTable";

const RentalsList = props => {

    // state variables
    const [rentals, setRentals] = useState([]);
    const [future, setFuture] = useState([]);
    const [current, setCurrent] = useState([]);
    const [past, setPast] = useState([]);

    const [alert, setAlert] = useState(null);

    // context variables
    const {authUser} = useContext(AuthContext);

    // load rentals of currently logged user at component mount
    useEffect(() => {
        API.getRentalsByUserId(authUser.id)
            .then(rentals => setRentals(rentals));
    }, [authUser]);

    // separate rentals into future, current and past when rentals are loaded
    useEffect(() => {
        const now = moment();
        setFuture(rentals.filter(r => moment(r.startingDay).isAfter(now)));
        setCurrent(rentals.filter(r => moment(r.startingDay).isBefore(now) && moment(r.endDay).isAfter(now)));
        setPast(rentals.filter(r => moment(r.endDay).isBefore(now)));
    }, [rentals]);


    const confirmCancel = rental => {
        setAlert(<Alert variant={"danger"}>
            <Alert.Heading>Cancel rental?</Alert.Heading>
            <p>The rental from {rental.startingDay} until {rental.endDay}{" "}
            will be canceled and you will receive a refund of {rental.amount.toLocaleString(
                        "it-IT",
                        {style: "currency", currency: "EUR"})}.</p>
            <hr />
            <div className={"d-flex justify-content-end"}>
                <Button
                    variant={"outline-secondary"}
                    onClick={() => setAlert(null)}
                >
                    Close
                </Button>
                <Button
                    className={"ml-3"}
                    variant={"outline-danger"}
                    onClick={() => cancelRental(rental.id)}
                >
                    Cancel rental
                </Button>
            </div>
        </Alert>);
    }

    // call API, then setAlert to OK or error
    const cancelRental = rentalId => {
        const successAlert = <Alert variant={"success"}>
            Your rental was successfully canceled. You will soon receive a refund.
            <div className={"d-flex justify-content-end"}>
                <Button
                    variant={"outline-success"}
                    onClick={() => setAlert(null)}
                >
                    OK
                </Button>
            </div>
        </Alert>;

        const errorAlert = <Alert variant={"danger"}>
            There was an error while canceling your rental. Please try again.
            <div className={"d-flex justify-content-end"}>
                <Button
                    variant={"outline-danger"}
                    onClick={() => setAlert(null)}
                >
                    Dismiss
                </Button>
            </div>
        </Alert>;

        API.toggleCanceledByRentalId(rentalId)
            .then(() => setAlert(successAlert))
            .catch(err => {
                setAlert(errorAlert);
                console.error(err);
            });
    }

    // sort date strings
    const dateSorter = (r1, r2) => {
        if (r1.startingDay < r2.startingDay) return 1;
        if (r1.startingDay > r2.startingDay) return -1;
        if (r1.startingDay === r2.startingDay)
            if (r1.endDay < r2.endDay) return 1;
            if (r1.endDay > r2.endDay) return -1;
            if (r1.endDay === r2.endDay) return 0;
    }

    return (
        !authUser ?
        <Redirect to={"/"} /> :
        <div id={"RentalsList"}>
            <Jumbotron>
                <h1>Your rentals</h1>
            </Jumbotron>
            {alert}
            {!rentals ?
            <Spinner animation="border" variant="warning" /> :
            <div>
                {future.length > 0 &&
                    <RentalsTable
                        title={"Future"}
                        rentals={future.sort((r1, r2) => dateSorter(r1, r2)).map((r, idx) => <Rental key={idx} rental={r} cancel={confirmCancel} />)}
                    />
                }
                {current.length > 0 &&
                    <RentalsTable
                        title={"Current"}
                        rentals={current.sort((r1, r2) => dateSorter(r1, r2)).map((r, idx) => <Rental key={idx} rental={r} cancel={null} />)}
                    />
                }
                {past.length > 0 &&
                    <RentalsTable
                        title={"History"}
                        rentals={past.sort((r1, r2) => dateSorter(r1, r2)).map((r, idx) => <Rental key={idx} rental={r} cancel={null} />)}
                    />
                }
            </div>
            }
        </div>
    );
}

export default RentalsList;