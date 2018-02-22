import {Actions} from '../components/wave-form/actions';

const defaultSlots = [{
    type: 'osc',
    params: {
        frequency: 440,
        overtone: 0,
        phase: 0,
        amplitude: 0.125
    }
}];

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
        // @todo abstract so you can add non oscillators
        return [...state, {type: 'osc', params: {...payload}}];
    }
    default:
        return state;
    }
};
