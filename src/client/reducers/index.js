import {combineReducers} from 'redux';
import {Audio} from '../../wave/audio';
import {slots} from './slots';

/* eslint-disable complexity */
export const config = (state = {}, {type, payload} = {}) => {
    switch (type) {
    case '@@redux/init': {
        const actx = new (window.AudioContext || window.webkitAudioContext)();
        const audio = new Audio(actx);
        return {audio};
    }
    case '@@INIT': {
        const actx = new (window.AudioContext || window.webkitAudioContext)();
        const audio = new Audio(actx);
        return {audio};
    }
    case 'LOADAUDIO': {
        const {audio} = state;
        return {audio, refAudio: payload, window: {tMin: 0, tMax: payload.duration}};
    }
    case 'WINDOW': {
        return {...state, window: {...payload}};
    }
    default:
        return state;
    }
};

const rootReducer = combineReducers({
    config,
    slots
});

export default rootReducer;
