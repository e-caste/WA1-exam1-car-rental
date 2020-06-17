import React from "react";
import {Button} from "react-bootstrap";


const Rental = props => {

    const convertDriversAge = age => {
        switch (age) {
            case 0:
                return "under 25";
            case 1:
                return "between 26 and 64";
            case 2:
                return "over 65";
            default:
                console.error("Unexpected driversAge value in carslist.Car");
                break;
        }
    }

    const convertEstimatedKilometers = km => {
        switch (km) {
            case 0:
                return "< 50 km";
            case 1:
                return "between 50 and 150 km";
            case 2:
                return "> 150 km";
            default:
                console.error("Unexpected kmPerDay value in carslist.Car");
                break;
        }
    }

    return (
        <tr>
            <td>{props.rental.startingDay}</td>
            <td>{props.rental.endDay}</td>
            <td>{props.rental.carCategory}</td>
            <td>{convertDriversAge(props.rental.driversAge)}</td>
            <td>{props.rental.extraDrivers === 1 ? "Yes" : "No"}</td>
            <td>{convertEstimatedKilometers(props.rental.estimatedKilometers)}</td>
            <td>{props.rental.insurance === 1 ? "Yes" : "No"}</td>
            <td>{props.rental.amount}</td>
            {props.cancel &&
            (!props.rental.canceled ?
            <td>
                <Button
                    variant={"outline-danger"}
                    onClick={() => props.cancel(props.rental)}
                >
                    Cancel
                </Button>
            </td> :
            <td>Yes</td>)
            }
            {!props.cancel &&
            <td>{props.rental.canceled ? "Yes" : "No"}</td>
            }
        </tr>
    );
}


export default Rental;