import React from "react";
import {Navbar} from "react-bootstrap";

const Footer = props =>
    <div id={"Footer"}
         className={"mt-auto"}
    >
        <Navbar
            sticky={"bottom"}
            variant={"light"}
        >
            <Navbar.Text className={"ml-auto mr-auto"}>Contact us</Navbar.Text>
            <Navbar.Text className={"ml-auto mr-auto"}>Our prices</Navbar.Text>
            <Navbar.Text className={"ml-auto mr-auto"}>Our locations</Navbar.Text>
            <Navbar.Text className={"ml-auto mr-auto"}>© 2020 Enrico Castelli</Navbar.Text>
        </Navbar>
    </div>

export default Footer;