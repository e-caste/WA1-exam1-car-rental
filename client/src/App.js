import "./App.css";

import React, {useState, useEffect, useMemo} from 'react';
import {Container} from "react-bootstrap";
import {Route, Redirect, Switch, useHistory} from "react-router-dom";

import API from "./api/API";
import Header from "./components/Header";
import {AuthContext} from "./auth/AuthContext";
import CarsList from "./components/CarsList";
import LoginForm from "./components/LoginForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import ConfiguratorForm from "./components/ConfiguratorForm";
import PaymentForm from "./components/PaymentForm";
import RentalsList from "./components/RentalsList";
import Footer from "./components/Footer";
import {serverErrorLUT} from "./utils/luts";


const App = () => {

    // context values managed as App state
    const [authUser, setAuthUser] = useState(null);
    const [loginError, setLoginError] = useState(null);
    const [rental, setRental] = useState(null);
    const [details, setDetails] = useState(null);

    // state variables
    const [cars, setCars] = useState([]);

    // go to /login at authorization error
    const {push} = useHistory();

    // initial API calls, note deps=[] to only call once like componentDidMount
    useEffect(() => {
        API.isLoggedIn()
            .then(user => setAuthUser(user))
            .catch(err => {
                switch (err) {
                    case serverErrorLUT.unavailable:
                    case serverErrorLUT.generic:
                        console.error(err);
                        break;
                    default:
                    case serverErrorLUT.authentication:
                        break;
                }
            })
    }, []);

    useEffect(() => {
        API.getAllCars()
            .then(cars => setCars(cars))
    }, []);

    // prevent context value always updating
    const value = useMemo(() => {

        // the following functions need to be here to prevent warning
        // saying they change at every render
        const handleLogin = (email, password) => {
            API.login(email, password)
                .then(user => {
                    setAuthUser(user);
                    setLoginError(null);
                })
                .catch(err => setLoginError(err));
        }

        const handleLogout = () => {
            API.logout()
                .catch(err => console.error(err));
            setAuthUser(null);
            setLoginError(null);
            setRental(null);
            setDetails(null);
        }

        const handleAuthorizationError = err => {
            if (err === serverErrorLUT.authentication) {
                setAuthUser(null);
                setLoginError(null);
                push("/login");
            }
        }

        return {
            authUser,
            loginError,
            handleLogin,
            handleLogout,
            handleAuthorizationError,
            rental,
            setRental,
            details,
            setDetails,
        }
    }, [authUser, loginError, rental, details, push]);

    return (
        <div className="App">
            <AuthContext.Provider value={value}>
                <Container fluid className={"d-flex flex-column min-vh-100"}>
                    <Header />
                    <Switch>
                        <Route exact path={"/"} render={() => <CarsList cars={cars}/>}/>
                        <Route path={"/login"} render={() => <LoginForm/>}/>
                        <Route path={"/logout"} render={() => <Redirect to={"/"} />}/>
                        <Route path={"/resetpassword"} render={() => <ResetPasswordForm />}/>
                        <Route path={"/rent"} render={() => <ConfiguratorForm cars={cars} />}/>
                        <Route path={"/payment"} render={() => <PaymentForm />}/>
                        <Route path={"/rentals"} render={() => <RentalsList />}/>
                        {/*redirect all other routes to the root page*/}
                        <Route path={"/"} render={() => <Redirect to={"/"} />}/>
                    </Switch>
                    <Footer />
                </Container>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
