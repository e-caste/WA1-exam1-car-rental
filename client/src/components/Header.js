// this component is called Header to prevent collisions with react-bootstrap's Navbar component

import React, {useContext, useState} from "react";
import {AuthContext} from "../auth/AuthContext";
import {Button, Navbar, Nav, NavDropdown} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";

const Header = props => {

    const {authUser, handleLogout} = useContext(AuthContext);
    const {push} = useHistory();

    // don't show login button if just clicked
    const [showButton, setShowButton] = useState(true);

    return (
        <Navbar bg={"warning"} collapseOnSelect expand={"md"} sticky={"top"}>
            <Navbar.Brand id={"header-title"}>
                <Link to={"/"} onClick={() => setShowButton(true)}>
                    <img src={"back-to-the-rental.svg"} width={30} height={30} alt={"logo"}/>
                </Link>
                {' '}BACK TO THE RENTAL
            </Navbar.Brand>

            <div className="ml-auto">
                {!authUser && showButton &&
                <Button
                    variant={"outline-dark"}
                    onClick={() => {push("/login"); setShowButton(false);}}
                >
                    Login
                </Button>
                }
                {authUser &&
                <Nav>
                    <NavDropdown title={`Welcome ${authUser.name || "back"}!`} id={"UserDropdown"}>
                        <NavDropdown.Item onClick={() => push("/rent")}>Rent a car</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => push("/rentals")}>Your rentals</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item onClick={() => {push("/logout"); setShowButton(true); handleLogout();}}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                }
            </div>
        </Navbar>
    );

}

export default Header;