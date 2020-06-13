import React, {useState} from "react";
import {Button, ButtonGroup, ButtonToolbar, Jumbotron, ListGroup, Spinner, Table} from "react-bootstrap";
import Car from "./carslist/Car";

const CarsList = props => {

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    return (
        <div id={"CarsList"}>
            <Jumbotron className={"mr-4"}>
                <h1>Our cars</h1>
            </Jumbotron>
            {!props.cars &&
                <Spinner animation="border" variant="warning" />
            }
            {props.cars &&
                <div id={"CarsView"}>
                    <ButtonToolbar>
                        <ButtonGroup>
                            Select categories
                            {/*use the Set to get only distinct categories*/}
                            {[...new Set(props.cars.map(car => car.category))]
                                .map((cat, idx) => <Button key={idx} variant={"warning"}>{cat}</Button>)}
                        </ButtonGroup>
                        <ButtonGroup>
                            Select brands
                            {/*use the Set to get only distinct brands*/}
                            {[...new Set(props.cars.map(car => car.brand))]
                                .map((br, idx) => <Button key={idx} variant={"warning"}>{br}</Button>)}
                        </ButtonGroup>
                    </ButtonToolbar>
                    {/*TODO: use cards, add fields from db*/}
                    <Table responsive striped borderless >
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>Model</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/*list of cars sorted in the DAO in the backend*/}
                            {props.cars.map((car, idx) => <Car key={idx} car={car} />)}
                        </tbody>
                    </Table>
                </div>
            }
        </div>
    );
}

export default CarsList;