import React, { Component } from "react";
import { Link } from "react-router-dom";

class Landing extends Component {
    render() {
        return (
            <div style={{ height: "75vh" }} className="container valign-wrapper">
                <div className="row">
                    <div className="col s12 center-align">
                        <h4>
                            <b>Privakey</b> embedded into a {" "}
                            <span style={{ fontFamily: "monospace" }}>MERN</span> app
                        </h4>
                        <p className="flow-text grey-text text-darken-1">
                            A minimal full-stack app showcasing authorizations using <a href="https://www.privakey.com" target="_blank">Privakey</a>
                        </p>
                        <br/>
                        <div className="col s6">
                            <Link
                                to="/register"
                                style={{
                                    width: "140px",
                                    borderRadius: "3px",
                                    letterSpacing: "1.5px"
                                }}
                                className="btn btn-large waves-effect waves-light hoverable orange accent-3"
                            >
                                Register
                            </Link>
                        </div>
                        <div className="col s6">
                            <Link
                                to="/login"
                                style={{
                                    width: "140px",
                                    borderRadius: "3px",
                                    letterSpacing: "1.5px"
                                }}
                                className="btn btn-large btn-flat waves-effect white black-text"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Landing;