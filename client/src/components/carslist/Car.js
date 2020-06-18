import React from "react";
import {Card} from "react-bootstrap";

const Car = props =>
    <Card>
        <Card.Img
            src={`cars/${props.car.brand.toLowerCase()}-${props.car.model.replace(" ", "-").toLowerCase()}.jpg`}
            alt={`${props.car.brand} ${props.car.model}`}
        />
        <Card.ImgOverlay>
            <Card.Title>{`${props.car.brand} ${props.car.model}`}</Card.Title>
            <Card.Subtitle>{props.car.category}</Card.Subtitle>
        </Card.ImgOverlay>
    </Card>

export default Car;