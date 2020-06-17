import React from "react";
import {Table} from "react-bootstrap";

const RentalsTable = props =>
    <div>
        <h2 className={"ml-2"}>{props.title}</h2>
        <Table responsive striped borderless>
            <thead>
            <tr>
                <th>From</th>
                <th>Until</th>
                <th>Category</th>
                <th>Age</th>
                <th>Extra drivers</th>
                <th>Km/day</th>
                <th>Insurance</th>
                <th>Paid</th>
                <th>Canceled</th>
            </tr>
            </thead>
            <tbody>
                {props.rentals}
            </tbody>
        </Table>
    </div>

export default RentalsTable;