import React, {Component} from 'react';
import {Display} from '../../../../../../wave/display';
import './style.scss';

export class Oscillator extends Component {

    constructor(props) {
        super(props);
    }

    playBuffer() {
        const {props: {audio}, buffer} = this;
        audio.play(buffer);
    }

    displayWaveform() {
        const {expanded, frequency, overtone, amplitude, phase, audio, duration, window} = this.props;

        if(expanded) {
            const osc = audio.createOscillator({frequency: frequency * (overtone + 1), amplitude, phase, duration});
            this.buffer = osc;
            const display = new Display(this.refs.canvas);
            display.renderBuffer(osc, window);
        }
    }

    componentDidMount() {
        this.displayWaveform();
    }

    componentDidUpdate() {
        this.displayWaveform();
    }

    render() {
        const {frequency, overtone, amplitude, phase, expanded, slot, stack, expand, update} = this.props;

        if(expanded) {
            return (
                <div className="wave-form oscillator" id={`waveform-${slot}`}>
                    <div className="menu-bar">
                        <span className="label">Oscillator</span>
                        <span className="operation">
                            <button onClick={() => expand({slot, stack, expanded: false})}>Minimize</button>
                            <i>+</i>
                        </span>
                    </div>
                    <div>
                        <canvas width="500" height="150" ref="canvas"/>
                    </div>
                    <div className="menu-bar">
                        <button onClick={() => {
                            this.playBuffer();
                        }}>play
                        </button>
                        <span>
                            <input
                                className="freq"
                                type="number"
                                defaultValue={frequency}
                                onChange={evt => update({slot, stack, frequency: parseFloat(evt.target.value)})}
                            />
                            <span>&nbsp;hz</span>
                        </span>
                        <span>
                            <input
                                className="overtone"
                                type="number"
                                defaultValue={overtone}
                                onChange={evt => update({slot, stack, overtone: parseFloat(evt.target.value)})}
                            />
                            <span>overtone</span>
                        </span>
                        <span>
                            <input
                                className="amplitude"
                                type="number"
                                min="0"
                                max="1"
                                step=".001"
                                defaultValue={amplitude}
                                onChange={evt => update({slot, stack, amplitude: parseFloat(evt.target.value)})}
                            />
                            <span>&nbsp;</span>
                        </span>
                        <span>
                            <input
                                className="phase"
                                type="number"
                                min="0"
                                max="360"
                                list="common-phase-numbers"
                                defaultValue={phase}
                                onChange={evt => update({slot, stack, phase: parseFloat(evt.target.value)})}
                            />
                            <span>&nbsp;°</span>
                        </span>
                    </div>
                </div>
            );
        }

        /* eslint-disable quotes */
        return (
            <div className="wave-form oscillator" id={`waveform-${slot}`} style={{width: '800px'}}>
                <div className="menu-bar">
                    <span className="label">
                        <span>Oscillator</span>
                        <span><b>Frequency:</b> {frequency}hz {overtone > 0 ? ` * ${(overtone + 1)}` : ``}</span>
                        <span><b>Amp:</b> {amplitude}</span>
                        <span><b>Phase:</b> {phase}°</span>
                    </span>
                    <span className="operation">
                        <button onClick={() => expand({slot, expanded: true})}>Expand</button>
                        <i>+</i>
                    </span>
                </div>
            </div>
        );
    }
}

export default Oscillator;
