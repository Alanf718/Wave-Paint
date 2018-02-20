import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';

import reducers from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import promiseMiddleware from 'redux-promise';

import Home from './containers/home';

const composeEnhancers = composeWithDevTools({});

const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(promiseMiddleware))
);

import './style.scss';

ReactDOM.render(
    <Provider store={store} >
        <Home/>
    </Provider>,
    document.querySelector('#app'));
