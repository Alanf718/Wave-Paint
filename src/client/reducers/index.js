import {combineReducers} from 'redux';
import {Audio} from '../../wave/audio';

export const config = (state = {}, {type, payload} = {}) => {
    switch (type) {
    case '@@INIT': {
        const actx = new (window.AudioContext || window.webkitAudioContext)();
        const audio = new Audio(actx);
        return {audio};
    }
    // @todo this might make more sense to move to the home reducer
    case 'LOADAUDIO': {
        const {audio} = state;
        return {audio, refAudio: payload};
    }
    default:
        return state;
    }
};

const rootReducer = combineReducers({
    config
});

export default rootReducer;
