import {
    SET_QR_DATA,
    SET_CURRENT_USER,
    USER_LOADING,
    START_REQUEST,
    UPDATE_REQUEST,
    SEND_AUTH_REQUEST,
    APPROVE_LOGIN,
    REJECT_LOGIN,
    RESET_LOGIN
} from "../actions/types";

import setAuthToken from "../utils/setAuthToken";

const isEmpty = require("is-empty");
const jwt_decode = require("jwt-decode");

const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false,
    requestState: '',
    qrData: {}
};

export default function(state = initialState, action) {
    console.log(action.type);
    console.log(action.data);
    switch(action.type) {
        case SET_QR_DATA:
            return {
                ...state,
                qrData: {
                    ...action.payload
                }
            };
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case USER_LOADING:
            return {
                ...state,
                loading: true
            };
        case START_REQUEST:
            return {
                ...state,
                requestState: 'INITIATED'
            };
        case SEND_AUTH_REQUEST:
            return {
                ...state,
                requestState: 'INITIATED'
            }
        case APPROVE_LOGIN:
            const { token } = action.data;
            localStorage.setItem("jwtToken", token);

            // Set token to auth header
            setAuthToken(token);

            // Decode token to get user data
            const decoded = jwt_decode(token);
            console.log(decoded);

            return {
                ...state,
                isAuthenticated: !isEmpty(decoded),
                user: decoded,
                requestState: '',
                loginMethod: ''
            };
        case REJECT_LOGIN:
            return {
                ...state,
                requestState: 'REJECTED',
                loginMethod: ''
            }
        case UPDATE_REQUEST:
            return {
                ...state,
                requestState: action.data.requestStatus
            };
        case RESET_LOGIN:
            return {
                ...state,
                requestState: ''
            }
        default:
            console.log('default');
            return state;
    }
}