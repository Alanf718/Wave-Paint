import {combineReducers} from 'redux';

export const example = (state = {}, {type} = {}) => {
    switch (type) {
    case 'DEBUG1':
        return {loggedIn: false, view: ''};
    default:
        return state;
    }
};

const rootReducer = combineReducers({
    example: example
});

export default rootReducer;
