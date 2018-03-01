import {Actions} from '../../../containers/home/components/wave-form/actions/index';

const defaultSlots = [{
    type: 'osc',
    expanded: true,
    params: {
        frequency: 440,
        overtone: 0,
        phase: 0,
        amplitude: 0.125
    }
}, /*{
    type: 'env',
    expanded: false,
    params: {
        attack: {x: 0.3, y: 1},
        decay: {x: 0.4, y: 0.5},
        release: {x: 0.9, y: 0.5},
        sustain: {x: 1, y: 0}
    }
}*/];

export const slots = (state = defaultSlots, {type, payload} = {}) => {
    switch (type) {
    case Actions.UPDATEWAVEFORM: {
        const {slot, ...props} = payload;
        const newState = [...state];
        newState[slot].params = {
            ...newState[slot].params,
            ...props
        };
        return newState;
    }
    case Actions.ADDWAVEFORM: {
        const {type: waveType, ...params} = payload;
        // expanded by default
        return [...state, {type: waveType, params: {...params}, expanded: true}];
    }
    case Actions.EXPANDWAVEFORM: {
        const {slot, expanded} = payload;
        const newState = [...state];
        newState[slot].expanded = expanded;
        return newState;
    }
    default:
        return state;
    }
};
