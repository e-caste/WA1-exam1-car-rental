import React, {useContext} from "react";
import {Redirect} from "react-router-dom";
import {AuthContext} from "../auth/AuthContext";

const ConfiguratorForm = props => {

    const {authUser} = useContext(AuthContext);

    return (
        !authUser ?
        <Redirect to={"/"} /> :
        <div id={"ConfiguratorForm"}>
            <h1>Test</h1>
        </div>
    );
}

export default ConfiguratorForm;