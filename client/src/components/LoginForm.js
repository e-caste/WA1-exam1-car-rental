import React, {useContext, useState} from "react";
import {Button, Col, Form, Jumbotron, Row} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import {AuthContext} from "../auth/AuthContext";

const LoginForm = props => {

    // state variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // context variable
    const context = useContext(AuthContext);

    const handleChange = event => {
        const t = event.target;
        switch (t.id) {
            case "form-email":
                setEmail(t.value);
                break;
            case "form-password":
                setPassword(t.value);
                break;
            default:
                console.error("Unexpected id in LoginForm.handleChange");
                break;
        }
    }

    const handleSubmit = (event, handleLogin) => {
        event.preventDefault();
        handleLogin(email, password);
    }

    return(<div>
            {context.authUser ?
                <Redirect to={"/"}/> :
                (<div id={"LoginForm"}>
                    <Jumbotron>
                        <h1>Login</h1>
                    </Jumbotron>
                    <Form
                        method={"POST"}
                        onChange={handleChange}
                        onSubmit={event => handleSubmit(event, context.handleLogin)}
                    >
                        <Form.Group controlId="form-email">
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                value={email}
                                required
                                autoFocus
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="form-password">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                required
                            />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" className={"pl-10"}>
                                    Login
                                </Button>
                            </Col>
                            <Col>
                                <Button href={"/resetpassword"} variant={"link"}>
                                    Forgot your password?
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>)
            }
        </div>
    );
}

export default LoginForm;