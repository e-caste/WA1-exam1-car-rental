// this component is called Header to prevent collisions with react-bootstrap's Navbar component

import React from "react";
import {AuthContext} from "../auth/AuthContext";
import {Navbar, Nav, NavDropdown} from "react-bootstrap";

const Header = props =>
    <AuthContext.Consumer>
        {context => (
            <Navbar bg={"warning"} collapseOnSelect expand={"md"} sticky={"top"}>
                <Navbar.Brand href={"/"}>
                    <img src={"back-to-the-rental.svg"} width={30} height={30}  alt={"logo"}/>
                    {' '}Back to the rental
                </Navbar.Brand>

                    <div className="ml-auto">
                        {!context.authUser &&
                            <Nav.Link href={"/login"}>Login</Nav.Link>
                        }
                        {context.authUser &&
                            <Nav>
                                <NavDropdown title={`Welcome ${context.authUser.name || "user"}!`}>
                                    <NavDropdown.Item href={"/rent"}>Rent a car</NavDropdown.Item>
                                    <NavDropdown.Item href={"/rentals"}>Your rentals</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href={"/logout"}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        }
                    </div>

            </Navbar>
        )}
    </AuthContext.Consumer>

export default Header;