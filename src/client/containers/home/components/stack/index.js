import React, {Component} from 'react';
import {Output} from '../wave-form/output';

import './style.scss';

export class Stack extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const {stack, slots, audio, duration, window, actions} = this.props;

        return (
            <div className="stack" id={`stack-${stack}`}>
                {
                    this.props.children
                }
                {
                    this.props.children.length > 0 ?
                        <Output
                            audio={audio}
                            slots={slots}
                            duration={duration}
                            window={window}/>
                        :
                        <div/>
                }
                <button id="add-waveform"
                    onClick={() => actions.add({
                        stack: stack,
                        type: 'osc',
                        frequency: 440,
                        overtone: 0,
                        phase: 0,
                        amplitude: 0.125
                    })}>
                    Add Oscillator
                </button>
                <button id="add-envelope"
                    onClick={() => actions.add({
                        stack: stack,
                        type: 'env',
                        attack: {x: 0.3, y: 1},
                        decay: {x: 0.4, y: 0.5},
                        release: {x: 0.9, y: 0.5},
                        sustain: {x: 1, y: 0}
                    })}>
                    Add Envelope
                </button>

            </div>
        );
    }
}

export default Stack;
