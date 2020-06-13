import React from "react";
import {Navbar} from "react-bootstrap";

const ResetPasswordForm = props =>
    <div id={"ResetPasswordForm"} className={"text-center  ml-6 mr-6"}>
        <img src={"sloth.svg"} height={200} />
        <h4>You may be interested in the <a href={"https://www.top10homeremedies.com/home-remedies/home-remedies-improve-memory.html"}>
                 top 10 home remedies to improve memory</a>.
        </h4>
        <Navbar fixed={"bottom"} className={"justify-content-center"}>
            <Navbar.Text>
                <h6 className={"text-muted"}>
                    I am not in any way affiliated with the website linked above.
                    <br />
                    This page was made as a joke since we are not required to set
                    up a mail server within this project.
                </h6>
            </Navbar.Text>
        </Navbar>
    </div>

export default ResetPasswordForm;