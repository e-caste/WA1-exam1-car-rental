// this component is called Header to prevent collisions with react-bootstrap's Navbar component

import React, {useContext} from "react";
import {AuthContext} from "../auth/AuthContext";
import {Navbar, Nav, NavDropdown} from "react-bootstrap";
import {Link} from "react-router-dom";

const Header = props => {

    const {authUser, handleLogout} = useContext(AuthContext);

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
                <Link to={"/login"}>Login</Link>
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