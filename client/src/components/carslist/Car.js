import React from "react";
// import {Card, ListGroup} from "react-bootstrap";

const Car = props =>
        <tr>
            <td>{props.car.category}</td>
            <td>{props.car.brand}</td>
            <td>{props.car.model}</td>
        </tr>

export default Car;