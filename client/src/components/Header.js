// this component is called Header to prevent collisions with react-bootstrap's Navbar component

import React, {useContext} from "react";
import {AuthContext} from "../auth/AuthContext";
import {Button, Navbar, Nav, NavDropdown} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";

const Header = props => {

    const {authUser, handleLogout} = useContext(AuthContext);
    const {push} = useHistory();

    return (
        <Navbar bg={"warning"} collapseOnSelect expand={"md"} sticky={"top"}>
            <Navbar.Brand>
                <Link to={"/"}>
                    <img src={"back-to-the-rental.svg"} width={30} height={30} alt={"logo"}/>
                </Link>
                {' '}Back to the rental
            </Navbar.Brand>

            <div className="ml-auto">
                {!authUser &&
                <Button
                    variant={"outline-dark"}
                    onClick={() => push("/login")}
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
                        <NavDropdown.Item onClick={() => {push("/logout"); handleLogout();}}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                }
            </div>
        </Navbar>
    );

}

export default Header;