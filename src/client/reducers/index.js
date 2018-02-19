import {combineReducers} from 'redux';
import {Audio} from '../../wave/audio';

export const config = (state = {}, {type} = {}) => {
    switch (type) {
    case '@@INIT':
        const actx = new (window.AudioContext || window.webkitAudioContext)();
        const audio = new Audio(actx);
        return {audio};
    default:
        return state;
    }
};

const rootReducer = combineReducers({
    config
});

export default rootReducer;
