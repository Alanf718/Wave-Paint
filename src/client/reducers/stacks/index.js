import {Actions} from '../../containers/home/components/stack/actions';

const defaultStacks = [];

export const slots = (state = defaultStacks, {type, payload} = {}) => {
    switch (type) {
    case Actions.ADDSTACK: {
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
