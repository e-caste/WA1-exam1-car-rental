import React, {useEffect, useState} from "react";
import {Col, Jumbotron, Spinner, Row, CardColumns, Container} from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Car from "./carslist/Car";

const CarsList = props => {

    // state variables
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [shownBrands, setShownBrands] = useState([]);
    const [shownCategories, setShownCategories] = useState([]);
    const [shownCars, setShownCars] = useState([]);

    // options variables used in Select component
    const [brandOptions, setBrandOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    // set brands and categories on change of props.cars
    useEffect(() => {
        setBrands([...new Set(props.cars.map(car => car.brand))].sort());
        setCategories([...new Set(props.cars.map(car => car.category))].sort());
        setShownCars(props.cars);
    }, [props.cars]);

    // update options every time the objects on which they depend are updated
    useEffect(() => {
        setBrandOptions(brands.map(br => Object.assign({value: br, label: br})));
    }, [brands]);

    useEffect(() => {
        setCategoryOptions(categories.map(cat => Object.assign({value: cat, label: cat})));
    }, [categories]);

    const handleBrandChange = selectedBrands => {
        // reset to empty list when removing all brands from selection
        setShownBrands(selectedBrands ? selectedBrands.map(br => br.value) : []);
    }

    const handleCategoryChange = selectedCategories => {
        // reset to empty list when removing all categories from selection
        setShownCategories(selectedCategories ? selectedCategories.map(cat => cat.value) : []);
    }

    // update shown cars based on selected brands and categories
    useEffect(() => {
        let result = props.cars;
        if (shownBrands.length > 0)
            result = result.filter(car => shownBrands.includes(car.brand));
        if (shownCategories.length > 0)
            result = result.filter(car => shownCategories.includes(car.category));
        // filter unique cars based on brand+model to only show different cars in the CarsList
        setShownCars(result
            .filter((car, index, self) => self.findIndex(c => c.brand === car.brand && c.model === car.model) === index));
    }, [shownBrands, shownCategories, props.cars]);

    return (
        <div id={"CarsList"}>
            <Jumbotron id={"jumbotron-carslist"}>
                <h1>our cars</h1>
            </Jumbotron>
            {!props.cars &&
                <Spinner animation="border" variant="warning" />
            }
            {props.cars &&
                <div id={"CarsView"}>
                    <Container>
                        <Col xs={16}>
                            <Row>
                                {/*see docs at https://react-select.com/home*/}
                                <Col>
                                    <Select
                                        placeholder={"Select brands..."}
                                        options={brandOptions}
                                        onChange={handleBrandChange}
                                        isMulti
                                        name={"brands"}
                                        components={makeAnimated()}
                                    />
                                </Col>
                                <Col>
                                    <Select
                                        placeholder={"Select categories..."}
                                        options={categoryOptions}
                                        onChange={handleCategoryChange}
                                        isMulti
                                        name={"categories"}
                                        components={makeAnimated()}
                                    />
                                </Col>
                            </Row>
                            <CardColumns className={"mt-3"}>
                                {/*list of cars sorted in the DAO in the backend*/}
                                {shownCars.map((car, idx) => <Car key={idx} car={car} />)}
                            </CardColumns>
                        </Col>
                    </Container>
                </div>
            }
        </div>
    );
}

export default CarsList;