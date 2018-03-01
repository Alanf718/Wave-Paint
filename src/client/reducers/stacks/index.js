import {Actions} from '../../containers/home/components/stack/actions';
import {slots} from './slots';
/*
const defaultStacks = [
    [{
        type: 'osc',
        expanded: true,
        params: {
            frequency: 440,
            overtone: 0,
            phase: 0,
            amplitude: 0.125
        }
    }]
];*/

const defaultStacks = [
    {slots: slots()},
    {slots: []}
];

export const stacks = (state = defaultStacks, {type, payload} = {}) => {
    // if stack is defined in the payload we have to go to the slot
    let currState = state;

    if(payload) {
        const {stack} = payload;

        if (stack >= 0) {
            currState = [...state];
            currState[stack].slots = slots(currState[stack].slots, {type, payload});
        }
    }

    switch (type) {
    case Actions.ADDSTACK: {
        return [...currState, []];
    }
    default:
        return currState;
    }
};
