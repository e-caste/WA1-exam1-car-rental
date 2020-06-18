import React from "react";
import {Button, Navbar, Row} from "react-bootstrap";
import {useHistory} from "react-router-dom";

const ResetPasswordForm = props => {

    const {push} = useHistory();

    return (
        <div id={"ResetPasswordForm"}>
            <Row className={"justify-content-center"}>
                <img
                    src={"sloth.svg"}
                    height={200}
                    alt={""}
                />
                <h4 className={"mt-5"}>
                    You may be interested in the <a
                    href={"https://www.top10homeremedies.com/home-remedies/home-remedies-improve-memory.html"}>
                    top 10 home remedies to improve memory</a>.
                </h4>
            </Row>
            <Row className={"mt-4 justify-content-center"}>
                <Button
                    variant={"outline-primary"}
                    onClick={() => push("/login")}
                >
                    Go back?
                </Button>
            </Row>
            <Navbar fixed={"bottom"} className={"text-center justify-content-center"}>
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