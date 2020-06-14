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

    // context values managed as App state
    const [authUser, setAuthUser] = useState(null);
    const [authErr, setAuthErr] = useState(null);

    // state variables
    const [cars, setCars] = useState([]);

    // initial API calls, note deps=[] to only call once like componentDidMount
    useEffect(() => {
        API.isLoggedIn()
            .then(user => setAuthUser(user))
            .catch(err => {
                switch (err) {
                    case "Server unavailable":
                    case "Server error":
                        console.error(err);
                        break;
                    default:
                    case "Authentication error":
                        break;
                }
            })
    }, []);

    useEffect(() => {
        API.getAllCars()
            .then(cars => setCars(cars))
    }, []);

    const handleLogin = (email, password) => {
        API.login(email, password)
            .then(user => setAuthUser(user))
            .catch(err => setAuthErr(err));
    }

    const handleLogout = () => {
        API.logout()
            .catch(err => console.error(err));
        setAuthUser(null);
        setAuthErr(null);
    }

    return (
        <div className="App">
            <AuthContext.Provider value={{
                authUser,
                authErr,
                handleLogin,
                handleLogout,
            }}>
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
                        <Route path={"/logout"} >
                            <Redirect to={"/"} />
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
