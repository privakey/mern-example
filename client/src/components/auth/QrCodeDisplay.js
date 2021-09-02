import React, {Component} from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { registerUser } from "../../actions/authActions";
import { connect } from 'react-redux';
import QRCode from 'qrcode.react';

class QrCodeDisplay extends Component {
    constructor() {
        super();
        this.state = {}
    }

    constructUrl = (bindData) => {
        const url = `authwallet://st=${bindData.sessionToken}&appSpaceGuid=${bindData.appSpaceGuid}&appSpaceName=${bindData.appSpaceName}`;
        const encodedUrl = encodeURI(url);
        return encodedUrl;
    }

    render() {
        let appBindURL = '';
        if(this.props.auth.qrData && this.props.auth.qrData.data) {
            appBindURL = this.constructUrl(this.props.auth.qrData.data);
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col s8 offset-s2 center">
                        <p>Finish registration by scanning the QR Code using the AuthWallet app:</p>
                        <QRCode value={appBindURL} size={300} includeMargin={true} />
                        <p>On a mobile device? <a href={appBindURL}>Click here</a> to finish registering directly.</p>
                        <p>After registering, proceed to <Link to="/login">Log in</Link></p>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

QrCodeDisplay.propTypes = {
    auth: PropTypes.object.isRequired
}

export default connect(
    mapStateToProps,
    { registerUser }
)(withRouter(QrCodeDisplay));