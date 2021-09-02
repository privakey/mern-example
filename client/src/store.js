import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';

const initialState = {};

let socket = io();
let socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

const middleware = [
    applyMiddleware(thunk), 
    applyMiddleware(socketIoMiddleware),
    ...(window.__REDUX_DEVTOOLS_EXTENSION__ ? [window.__REDUX_DEVTOOLS_EXTENSION__()] : [])
];

const store = createStore(
    rootReducer,
    initialState,
    compose(...middleware)
);

export default store;