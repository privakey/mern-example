const express = require("express");
const router = express.Router();
const config = require("config");
const axios = require("axios");

// Load input validation
const validateRegisterInput = require("../../validation/register");

// Load user model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        let bindUser;
        if(user) {
            // User already exists, allow it to be reused
            bindUser = user;
        } else {
            bindUser = new User({
                name: req.body.name,
                email: req.body.email,
            });

            bindUser.save();
        }

        // Call privakey bind
        axios.request({
            url: config.get('privakeyUrl') + 'account/bind',
            method: 'put',
            headers: {
                'Authorization': 'Basic ' + config.get('privakeyBasicAuth'),
                'Content-Type': 'application/json'
            },
            data: {
                'accountId': bindUser._id
            }
        })
        .then((bindRes) => {
            console.log('CX Bind successful, full response: ', bindRes.data);
            res.json(bindRes.data);
        })
        .catch((error) => {
            console.log(error);
        })
    });
});

module.exports = router;