import React, {useState, useEffect} from 'react';

import API from "./api/API";
import Header from "./components/Header";
import {AuthContext} from "./auth/AuthContext";


const App = () => {

    const [cars, setCars] = useState([]);
    useEffect(() => {
        API.getAllCars()
            .then(cars => setCars(cars))
    }, []);

    return (
    <div className="App">
        <AuthContext.Provider value={{authUser: {}}}>
            <Header/>
        </AuthContext.Provider>
    </div>
    );
}

export default App;
