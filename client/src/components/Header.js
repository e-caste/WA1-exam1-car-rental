// this component is called Header to prevent collisions with react-bootstrap's Navbar component

import React, {useContext} from "react";
import {AuthContext} from "../auth/AuthContext";
import {Navbar, Nav, NavDropdown} from "react-bootstrap";

const Header = props => {

    const {authUser, authErr, handleLogin, handleLogout} = useContext(AuthContext);

    return (
        <Navbar bg={"warning"} collapseOnSelect expand={"md"} sticky={"top"}>
            <Navbar.Brand href={"/"}>
                <img src={"back-to-the-rental.svg"} width={30} height={30} alt={"logo"}/>
                {' '}Back to the rental
            </Navbar.Brand>

            <div className="ml-auto">
                {!authUser &&
                <Nav.Link href={"/login"}>Login</Nav.Link>
                }
                {authUser &&
                <Nav>
                    <NavDropdown title={`Welcome ${authUser.name || "user"}!`} id={"UserDropdown"}>
                        <NavDropdown.Item href={"/rent"}>Rent a car</NavDropdown.Item>
                        <NavDropdown.Item href={"/rentals"}>Your rentals</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item href={"/logout"} onClick={handleLogout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                }
            </div>
        </Navbar>
    );

}

export default Header;