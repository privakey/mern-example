import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
    SET_QR_DATA,
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING,
    START_REQUEST,
    SEND_AUTH_REQUEST,
    RESET_LOGIN
} from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        .post("/api/users/register", userData)
        .then(res => {
            dispatch({
                type: SET_QR_DATA,
                payload: res
            });
            history.push("/qrcode");
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const initiateLogin = userEmail => dispatch => {
    dispatch({
        type: SEND_AUTH_REQUEST,
        data: { 'email': userEmail }
    });
}

export const cancelRequest = () => dispatch => {
    dispatch({
        type: RESET_LOGIN
    });
}

// Login - get user token
export const loginUser = userData => dispatch => {
    axios
        .post("/api/users/login", userData)
        .then(res => {
            // Save to localStorage
            const { token } = res.data;
            localStorage.setItem("jwtToken", token);

            // Set token to auth header
            setAuthToken(token);

            // Decode token to get user data
            const decoded = jwt_decode(token);

            // Set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

// User loading
export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem("jwtToken");

    // Remove auth header for future requests
    setAuthToken(false);

    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};

export const sendNotification = () => dispatch => {
    // Get token from local storage
    let token = localStorage.getItem("jwtToken");

    // Figure out account id
    let payload = JSON.parse(atob(token.split('.')[1]));
    
    dispatch({
        type: START_REQUEST,
        data: { 'accountId': payload.id }
    });
}