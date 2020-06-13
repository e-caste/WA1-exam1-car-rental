import React, {useState, useEffect} from 'react';
import {Container, Switch} from "react-bootstrap";
import {Route, Redirect} from "react-router-dom";

import API from "./api/API";
import Header from "./components/Header";
import {AuthContext} from "./auth/AuthContext";
import CarsList from "./components/CarsList";
import LoginForm from "./components/LoginForm";
import ResetPasswordForm from "./components/ResetPasswordForm";


const App = () => {

    const [authUser, setAuthUser] = useState(null);
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
                        <Route exact path={"/"}>
                            <CarsList
                                cars={cars}
                            />
                        </Route>
                        <Route path={"/login"}>
                            <LoginForm />
                        </Route>
                        <Route path={"/resetpassword"}>
                            <ResetPasswordForm />
                        </Route>
                        <Route path={"/rent"}>

                        </Route>
                        <Route path={"/payment"}>

                        </Route>
                        <Route path={"/rentals"}>

                        </Route>
                    </Switch>
                </Container>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
