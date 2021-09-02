module.exports = function(io) {
    const express = require("express");
    const router = express.Router();
    const config = require("config");
    const jwt = require("jsonwebtoken");

    const User = require("../models/User");
    const ActiveRequest = require("../models/ActiveRequests");

    function emit(socket, type, data) {
        socket.emit('action', {
            type: type,
            data: data
        });
    }

    // @route auth/processRequest
    // @desc Lets the user know their request has updated. This is called by the PrivakeyCX Auth Server.
    router.post("/processRequest", (req, res) => {
        ActiveRequest.findOne( {requestGuid: req.body.guid}, function(err, activeRequest) {
            if(err) {
                console.log(err);
            } else {
                let socket = io.sockets.connected[activeRequest.socketId];
                if(!socket) {
                    console.log('No socket found for request, exiting out.');
                    res.status(204).send();
                    return;
                }

                console.log('activeRequest: ' + activeRequest);
                console.log('requestType: ' + activeRequest.requestType);

                if (activeRequest.requestType === 'auth') {
                    if(req.body.buttonSelected == 0) {
                        User.findOne({ _id: activeRequest.accountId }).then(user => {
                            const payload = {
                                id: user._id,
                                name: user.name
                            };

                            jwt.sign(payload, config.get("secretOrKey"), { expiresIn: 31556926 },
                                (err, token) => { 
                                    emit(socket, 'server/APPROVE_LOGIN', {
                                        success: true,
                                        token: "Bearer " + token
                                    });
                                });
                        });
                    } else {
                        emit(socket, 'server/REJECT_LOGIN', { });
                    }
                } else {
                    if(req.body.buttonSelected == 0) {
                        emit(socket, 'server/UPDATE_REQUEST', { requestStatus: 'APPROVED' });
                    } else {
                        emit(socket, 'server/UPDATE_REQUEST', { requestStatus: 'REJECTED' });
                    }
                }

                res.status(204).send();
            }
        });
    });

    return router;
}