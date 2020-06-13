import React, {useState, useEffect} from 'react';

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
        </AuthContext.Provider>
    </div>
    );
}

export default App;
