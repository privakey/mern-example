# Milo App

Milo is a sample project that integrates [PrivakeyCX](https://www.privakey.com) into a MERN app. The purpose of this project is to provide code samples and usage examples of PrivakeyCX. The project covers logging in to the example site with Privakey, and allows an authenticated user to send a Privakey challenge request to themselves via the mobile app AuthWallet (available on [Google Play](https://play.google.com/store/apps/details?id=com.privakey.authwallet) and [App Store](https://apps.apple.com/us/app/authwallet/id1552057206)).

## Before You Begin

For the sample to work properly, you'll need a few things:

* The AuthWallet App installed on your mobile device
* A Relying Party set up on Privakey CX
* A MongoDB database set up
* A publicly-reachable location to host the site

Instructions on the first two requirements can be found in our [Quick Start guide](https://tech.privakey.com/cloudAdoption/pkCloudGettingStarted). When creating the Request Origin, you will need to supply a callback of the form <hosted-site-url>/auth/processRequest, E.G. https://milo.sample.com/auth/processRequest.

The site has to be publicly-reachable because it requires a callback from Privakey CX.

After you're fully set up, make sure you update the config values in `config/default.json`.

## Code Outline

The quickest way to get an understanding of how to use Privakey is to step through a user's interaction with it. The general outline of using Milo is as follows:

1. Register a New Account
1. Log In
1. Send a Misc. Request

### Register a New Account

Registering happens in `routes/api/users.js`. It's straightforward in that it adds the user to the DB (or retrieves them if they already exist). After that, things get more complicated. The register function calls out to the CX Server to perform a bind, which associates Milo's user ID with a CX ID. The call that comes back has info that is required by AuthWallet to complete the bind, so it must be forwarded to the front-end which uses it to construct a QR Code.

The QR Code construction happens in `client/src/components/auth/QrCodeDisplay.js`. It combines the data returned from the CX Bind call into a single URL that is parseable by AuthWallet. The user then scans this QR Code using the app to complete their registration.

### Log In

Now that registering is complete, the user can log in. This is done via a websocket, because it requires 2-way communication. First, a Challenge Request is sent to the user's AuthWallet. Then, the response of that Challenge is returned to the front-end so it can display the appropriate view to the user depending on whether they approved or rejected the Challenge.

The logic for sending the Challenge Request is in `helpers/websocket.js`. This file also handles sending a Misc. Request later on, so it has logic to differentiate between the Request types. The login Challenge type is "sendAuthRequest". It sets up the content in a very specific way, which is required by AuthWallet to display the request correctly. It must have a `title` and `keys`, which is an array of `key` & `value` pairs. The `buttons` array is optional, but it gets set up here as well for customization.

Once the Request is constructed, it's sent to the CX Server. It is then passed to the user's AuthWallet app, where they can approve or reject it. After it's acted upon, the CX Server lets Milo know the response via a callback. This callback is set up in the CX Admin Portal, and for Milo it is `/processRequest`, which is located in the file `routes/privakey.js`.

This callback function checks the request in the database in order to find the current websocket it's associated with, and then sends the response along that websocket. Thanks to the redux-socket.io package, this websocket data is passed directly to the reducer in `client/src/reducers/authReducers.js`, which sets the data and causes the login page to update automatically, as it uses both `componentWillReceiveProps()` (for Request approvals) and has conditionals built into the render function (for Request rejections).

Assuming the user approved the Request, they are now logged in!

### Send a Misc. Request

The last piece of functionality is sending a miscellaneous request while logged in. This is very similar to the initial Login request, and mostly only exists to showcase sending a Request with different data. As mentioned previously, sending this Request also happens in `helpers/websocket.js`, but this time the type is "sendRequest" so it enters a different part of the if statement.

## Acknowledgements

* Huge thank-you to Rishi Prasad, whose [MERN tutorial](https://blog.bitsrc.io/build-a-login-auth-app-with-mern-stack-part-1-c405048e3669) was extremely helpful.
* [itaylor](https://github.com/itaylor) for the [redux-socket.io library](https://github.com/itaylor/redux-socket.io).