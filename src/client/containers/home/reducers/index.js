import {combineReducers} from 'redux';

export const slots = (state = {}, {type} = {}) => {
    switch (type) {
    default:
        return state;
    }
};

const rootReducer = combineReducers({
    slots
});

export default rootReducer;
