import React, {useState, useEffect} from 'react';
import {Container, Switch} from "react-bootstrap";
import {Route, Redirect} from "react-router-dom";

import API from "./api/API";
import Header from "./components/Header";
import {AuthContext} from "./auth/AuthContext";


const App = () => {

    const [authUser, setAuthUser] = useState({});
    const [cars, setCars] = useState([]);

    // initial API calls, note deps=[] to only call once like componentDidMount
    useEffect(() => {
        API.isLoggedIn()
            .then(user => setAuthUser(user))
    }, []);

    useEffect(() => {
        API.getAllCars()
            .then(cars => setCars(cars))
    }, []);

    return (
        <div className="App">
            <AuthContext.Provider value={{authUser: authUser}}>
                <Header/>
                <Container fluid>
                    <Switch>
                        <Route path={"/"}>

                        </Route>
                        <Route path={"/login"}>

                        </Route>
                        <Route path={"/rent"}>

                        </Route>
                        <Route path={"/payment"}>

                        </Route>
                        <Route path={"/rentals"}>

                        </Route>
                        <Route>
                            <Redirect to={"/"} />
                        </Route>
                    </Switch>
                </Container>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
