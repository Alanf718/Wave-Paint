import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';

import reducers from './reducers';
import { routerReducer, routerMiddleware, ConnectedRouter } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createHistory from 'history/createBrowserHistory';

// import Home from './containers/home';

const history = createHistory();

const middleware = routerMiddleware(history);
const composeEnhancers = composeWithDevTools({});

const store = createStore(
    combineReducers({...reducers, routing: routerReducer}),
    composeEnhancers(applyMiddleware(middleware))
);

import './style.scss';
import {Home} from "./containers/home";

ReactDOM.render(
    <Provider store={store} >
        <Home/>
    </Provider>,
    document.querySelector('#entry'));
