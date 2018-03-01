import React, {Component} from 'react';
import {Display} from '../../../../../../wave/display';
import './style.scss';

export class Output extends Component {

    constructor(props) {
        super(props);
    }

    playBuffer() {
        const {props: {audio}, buffer} = this;
        audio.play(buffer);
    }

    displayWaveform() {
        const {audio, duration, slots, window} = this.props;

        const combineStack = allSlots => {
            return allSlots.reduce((acc, slot) => {
                if(Array.isArray(slot)) {
                    return audio.sum({buffer1: acc, buffer2: combineStack(slot)});
                }

                const {type} = slot;
                if (type === 'osc') {
                    const {params: {frequency, overtone, phase, amplitude}} = slot;
                    const osc = audio.createOscillator({
                        frequency: frequency * (overtone + 1), amplitude, phase, duration
                    });
                    return audio.sum({buffer1: acc, buffer2: osc});
                } else if (type === 'env') {
                    /* eslint-disable */
                    const {params: {attack, decay, release, sustain}} = slot;
                    const env = audio.createEnvelope({duration, attack, decay, release, sustain});
                    return audio.product({buffer1: acc, buffer2: env});
                }
                return acc;
            }, audio.createEmpty({duration}));
        };

        const output = combineStack(slots);

        this.buffer = output;
        const display = new Display(this.refs.canvas);
        display.renderBuffer(output, window);
    }

    componentDidMount() {
        this.displayWaveform();
    }

    componentDidUpdate() {
        this.displayWaveform();
    }

    render() {
        const {width = 500} = this.props;

        return (
            <div className="wave-form output" id="output">
                <div className="menu-bar">
                    <span className="label">Output</span>
                </div>
                <div>
                    <canvas width={width} height="150" ref="canvas"/>
                </div>
                <div className="menu-bar">
                    <button onClick={() => {this.playBuffer();}}>play</button>
                </div>
            </div>
        );
    }
}

export default Output;
