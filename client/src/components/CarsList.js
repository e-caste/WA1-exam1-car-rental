import React, {useEffect, useState} from "react";
import {Col, Jumbotron, Spinner, Row, Table} from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Car from "./carslist/Car";

const CarsList = props => {

    // state variables
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    // options variables used in Select component
    const [brandOptions, setBrandOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    // set brands and categories on change of props.cars
    useEffect(() => {
        setBrands([...new Set(props.cars.map(car => car.brand))].sort());
    }, [props.cars]);

    useEffect(() => {
        setCategories([...new Set(props.cars.map(car => car.category))].sort());
    }, [props.cars]);

    // update options every time the objects on which they depend are updated
    useEffect(() => {
        setBrandOptions(brands.map(br => Object.assign({value: br, label: br})));
    }, [brands]);

    useEffect(() => {
        setCategoryOptions(categories.map(cat => Object.assign({value: cat, label: cat})));
    }, [categories]);

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
                    <Row>
                        {/*see docs at https://react-select.com/home*/}
                        <Col>
                            <Select placeholder={"Select brands..."} options={brandOptions} isMulti name={"brands"} components={makeAnimated()} />
                        </Col>
                        <Col>
                            <Select placeholder={"Select categories..."} options={categoryOptions} isMulti name={"categories"} components={makeAnimated()} />
                        </Col>
                    </Row>
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