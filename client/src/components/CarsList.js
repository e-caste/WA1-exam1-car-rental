import React, {useState} from "react";
import {Button, ButtonGroup, ButtonToolbar, Dropdown, Jumbotron, ListGroup, Spinner, Table} from "react-bootstrap";
import Car from "./carslist/Car";
import DropdownButton from "react-bootstrap/DropdownButton";

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
                    <DropdownButton title={"Select categories"} variant={"warning"} as={ButtonGroup}>
                            {/*use the Set to get only distinct categories*/}
                            {[...new Set(props.cars.map(car => car.category))]
                                .map((cat, idx) => <Dropdown.Item key={idx} variant={"warning"}>{cat}</Dropdown.Item>)}
                    </DropdownButton>
                    <DropdownButton title={"Select brands"} variant={"warning"} as={ButtonGroup} className={"ml-2"}>
                            {/*use the Set to get only distinct brands*/}
                            {[...new Set(props.cars.map(car => car.brand))]
                                .map((br, idx) => <Dropdown.Item key={idx} variant={"warning"}>{br}</Dropdown.Item>)}
                    </DropdownButton>
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