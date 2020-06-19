import React from "react";
import {Button, Container, Navbar, Row} from "react-bootstrap";
import {useHistory} from "react-router-dom";

const ResetPasswordForm = props => {

    const {push} = useHistory();

    return (
        <div id={"ResetPasswordForm"}>
            <Container>
                <Row className={"justify-content-center"}>
                    <img
                        className={"my-5 mx-auto d-block"}
                        src={"sloth.svg"}
                        height={200}
                        alt={""}
                    />
                </Row>
                <Row className={"mt-3 justify-content-center"}>
                    <h4>
                        You may be interested in the <a
                        href={"https://www.top10homeremedies.com/home-remedies/home-remedies-improve-memory.html"}>
                        top 10 home remedies to improve memory</a>.
                    </h4>
                </Row>
                <Row className={"mt-5 justify-content-center"}>
                    <Button
                        variant={"outline-primary"}
                        onClick={() => push("/login")}
                    >
                        Go back?
                    </Button>
                </Row>
            </Container>
            <Navbar
                id={"footer-resetpasswordform"}
                fixed={"bottom"}
                className={"text-center justify-content-center"}
            >
                <Navbar.Text>
                    <h6 className={"text-muted"}>
                        I am not in any way affiliated with the website linked above.
                        <br/>
                        This page was made as a joke since we are not required to set
                        up a mail server within this project.
                    </h6>
                </Navbar.Text>
            </Navbar>
        </div>
    );
}

export default ResetPasswordForm;