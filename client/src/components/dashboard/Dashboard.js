import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, sendNotification } from "../../actions/authActions";

class Dashboard extends Component {
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    onSendNotify = e => {
        e.preventDefault();
        this.props.sendNotification();
    }

    getRequestColor = () => {
        let className = '';
        switch(this.props.auth.requestState) {
            case 'INITIATED':
                className = 'grey';
                break;
            case 'APPROVED':
                className = 'blue';
                break;
            case 'SENT':
                className = 'purple';
                break;
            case 'REJECTED':
                className = 'orange';
                break;
            default:
                className = 'grey';
                break;
        }

        className += '-text';
        return className;
    }

    getRequestFriendlyText = () => {
        let text = '';
        switch(this.props.auth.requestState) {
            case 'APPROVED':
                text = 'Neat!';
                break;
            case 'REJECTED':
                text = 'Okay...';
                break;
            default:
                text = this.props.auth.requestState;
                break;
        }
        return text;
    }

    render() {
        const { user, requestState } = this.props.auth;

        return (
            <div style={{ height: "75vh" }} className="container valign-wrapper">
                <div className="row">
                    <div className="col s12 center-align">
                        <h4>
                            <b>Hey there,</b> {user.name.split(" ")[0]}. You're now logged in!

                            { requestState === '' ? (
                                <p className="flow-text grey-text text-darken-1">
                                    Click below to send a Privakey Request to yourself.
                                </p>
                            ) : (
                                <p className="flow-text grey-text text-darken-1">
                                    Request state:{' '}
                                    <span 
                                        className={this.getRequestColor()}
                                    >
                                        { this.getRequestFriendlyText() }
                                    </span>
                                </p>
                            )}
                        </h4>
                        <div className="col s6">
                            <button
                                onClick={this.onSendNotify}
                                className="btn btn-large waves-effect waves-light hoverable orange accent-3"
                            >
                                Send Request
                            </button>
                        </div>
                        <div className="col s6">
                            <button
                                onClick={this.onLogoutClick}
                                className="btn btn-large btn-flat waves-effect white black-text"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    sendNotification: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser, sendNotification }
) (Dashboard);