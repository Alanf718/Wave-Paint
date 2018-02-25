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
        const {frequency, overtone, amplitude, phase, audio, duration, window} = this.props;

        const osc = audio.createOscillator({frequency: frequency * (overtone + 1), amplitude, phase, duration});
        this.buffer = osc;
        const display = new Display(this.refs.canvas);
        display.renderBuffer(osc, window);
    }

    componentDidMount() {
        this.displayWaveform();
    }

    componentDidUpdate() {
        this.displayWaveform();
    }

    render() {
        const {frequency, overtone, amplitude, phase, slot, update} = this.props;

        return (
            <div className="wave-form oscillator" id={`waveform-${slot}`}>
                <div className="menu-bar">
                    <span className="label">Oscillator</span>
                    <span className="operation"><i>+</i></span>
                </div>
                <div>
                    <canvas width="800" height="150" ref="canvas"/>
                </div>
                <div className="menu-bar">
                    <button onClick={() => {this.playBuffer();}}>play</button>
                    <span>
                        <input
                            className="freq"
                            type="number"
                            defaultValue={frequency}
                            onChange={evt=>update({slot, frequency: parseFloat(evt.target.value)})}
                        />
                        <span>&nbsp;hz</span>
                    </span>
                    <span>
                        <input
                            className="overtone"
                            type="number"
                            defaultValue={overtone}
                            onChange={evt=>update({slot, overtone: parseFloat(evt.target.value)})}
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
                            onChange={evt=>update({slot, amplitude: parseFloat(evt.target.value)})}
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
                            onChange={evt=>update({slot, phase: parseFloat(evt.target.value)})}
                        />
                        <span>&nbsp;°</span>
                    </span>
                </div>
            </div>
        );
    }
}

export default Oscillator;
