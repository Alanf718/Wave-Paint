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

    componentDidMount() {
        const {frequency, amplitude, phase, audio, duration} = this.props;

        if(!this.buffer) {
            const osc = audio.createOscillator({frequency, amplitude, phase, duration});
            this.buffer = osc;
            const display = new Display(this.refs.canvas);
            display.renderBuffer(osc, {tMin: 0, tMax: 0.01});
        }
    }

    componentDidUpdate() {
        const {frequency, amplitude, phase, audio, duration} = this.props;

        if(!this.buffer) {
            const osc = audio.createOscillator({frequency, amplitude, phase, duration});
            this.buffer = osc;
            const display = new Display(this.refs.canvas);
            display.renderBuffer(osc, {tMin: 0, tMax: 0.01});
        }
    }

    render() {
        const {frequency, amplitude, phase, id} = this.props;

        return (
            <div className="wave-form oscillator" id={id}>
                <div className="menu-bar">
                    <span className="label">Oscillator</span>
                    <span className="operation"><i>*</i></span>
                </div>
                <div>
                    <canvas width="800" height="150" ref="canvas"/>
                </div>
                <div className="menu-bar">
                    <button onClick={() => {this.playBuffer();}}>play</button>
                    <span>
                        <input className="freq" type="number" defaultValue={frequency}/>
                        <span>&nbsp;hz</span>
                    </span>
                    <span>
                        <input className="amplitude" type="number" min="0" max="100" defaultValue={amplitude}/>
                        <span>&nbsp;%</span>
                    </span>
                    <span>
                        <input
                            className="phase"
                            type="number"
                            min="0"
                            max="360"
                            list="common-phase-numbers"
                            defaultValue={phase}/>
                        <span>&nbsp;°</span>
                    </span>
                </div>
            </div>
        );
    }
}

export default Oscillator;
