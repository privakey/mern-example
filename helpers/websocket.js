const axios = require('axios');
const config = require("config");
const User = require("../models/User");
const ActiveRequest = require("../models/ActiveRequests");

function ioHelper (server, session) {
    let io = require("socket.io")(server);
    let sharedsession = require('express-socket.io-session');

    io.on('connection', function(socket) {
        console.log("Connection established, socket ID: " + socket.id);
        socket.on('disconnect', () => {
            console.log("User disconnected, socket ID: " + socket.id);
            ActiveRequest.findOneAndDelete(
                {socketId: socket.id},
                (err, removedRequest) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log(removedRequest);
                    }
                }
            );
        });

        socket.on('action', (action) => {
            console.log(action);
            if(action.type === 'server/sendRequest') {
                // Sending a miscellaneous Challenge Request.
                const content = {
                    title: 'Sample Request',
                    keys: [
                        {
                            key: 'Welcome to AuthWallet',
                            value: 'This is a sample request sent from Milo that showcases the possibilities of AuthWallet.'
                        }, {
                            key: 'Multiple Headings',
                            value: 'You can easily have multiple headings in the request, or change the buttons (as you can see below).'
                        }
                    ]
                }
                const buttons = [
                    { title: "Neat!", strongAuth: false, style: '{"color": "blue"}' },
                    { title: "Okay...", strongAuth: true, style: '{"color": "orange"}' }
                ]
                sendRequest(action.data.accountId, 'generic', socket, content, '10m', buttons);
            } else if (action.type === 'server/sendAuthRequest') {
                // Sending a Login Challenge Request.
                const email = action.data.email;
                User.findOne({ email }).then(user => {
                    console.log(user);
                    const content = {
                        title: 'Login to Milo',
                        keys: [ { 
                            key: 'Logging in?',
                            value: 'Tap below to approve the login to Milo using the email ' + email + '.' 
                        } ]
                    };
                    const buttons = [
                        { title: "Approve", strongAuth: true, style: '{"color": "green"}' },
                        { title: "Reject", strongAuth: false, style: '{"color": "red"}' }
                    ];
                    sendRequest(user._id, 'auth', socket, content, '2m', buttons);
                });
            }
        });
    });

    function sendRequest (accountId, requestType, socket, content, duration, buttons) {
        axios.request({
            url: config.get("privakeyUrl") + "request/add",
            method: 'post',
            headers: {
                'Authorization': 'Basic ' + config.get("privakeyBasicAuth"),
                'Content-Type': 'application/json'
            },
            data: {
                'accountId': accountId,
                'callback': config.get("serverUrl") + '/auth/processRequest',
                'content': content,
                'duration': duration,
                'additionalInfo': "{'viewType': 'html', 'format': 'standard'}",
                'showNotification': true,
                'buttons': buttons
            }
        })
        .then((requestRes) => {
            let activeRequest = new ActiveRequest({
                accountId: accountId,
                requestGuid: requestRes.data.guid,
                socketId: socket.id,
                requestType: requestType
            });

            activeRequest.save(function(err, activeRequest) {
                if(err) {
                    console.log(err);
                } else if (activeRequest) {
                    console.log(activeRequest);
                }
            });

            socket.emit('action', {
                type: 'server/UPDATE_REQUEST',
                data: {
                    requestStatus: 'SENT'
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    io.use(sharedsession(session, {autoSave: true}));

    return function getIo() {
        return io;
    }
}

module.exports.ioHelper = ioHelper;