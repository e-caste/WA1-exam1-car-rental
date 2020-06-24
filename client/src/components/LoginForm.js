import React, {useContext, useState} from "react";
import {Alert, Button, Col, Container, Form, Jumbotron, Row} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import {AuthContext} from "../auth/AuthContext";
import {useHistory} from "react-router-dom";

const LoginForm = props => {

    // state variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // context variables
    const {authUser, loginError, handleLogin} = useContext(AuthContext);
    const {push} = useHistory();

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

    return(authUser ?
            <Redirect to={"/"}/> :
            (<div id={"LoginForm"}>
                <Jumbotron id={"jumbotron-loginform"}>
                    <h1>login</h1>
                </Jumbotron>
                <Form
                    method={"POST"}
                    onChange={handleChange}
                    onSubmit={event => handleSubmit(event, handleLogin)}
                >
                    <Container className={"d-flex justify-content-center"}>
                        <Col xs={7}>
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
                                    <Button block variant={"primary"} type={"submit"}>
                                        Login
                                    </Button>
                                </Col>
                                <Col>
                                    <Button block variant={"link"} onClick={() => push("/resetpassword")}>
                                        Forgot your password?
                                    </Button>
                                </Col>
                            </Row>
                            {loginError && <Alert variant={"danger"} className={"text-center"}>{loginError}</Alert>}
                        </Col>
                    </Container>
                </Form>
            </div>)
    );
}

export default LoginForm;