import React, {Component} from 'react';
import {Display} from '../../../../../../wave/display';
import './style.scss';

export class Oscillator extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {frequency, amplitude, phase, audio, duration} = this.props;

        const osc = audio.createOscillator({frequency, amplitude, phase, duration});
        const display = new Display(this.refs.canvas);
        display.renderBuffer(osc, {tMin: 0, tMax: 0.01});
        // audio.play(osc);
    }

    componentDidUpdate() {
        const {frequency, amplitude, phase, audio, duration} = this.props;

        const osc = audio.createOscillator({frequency, amplitude, phase, duration});
        const display = new Display(this.refs.canvas);
        display.renderBuffer(osc, {tMin: 0, tMax: 0.01});
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

                    <datalist id="common-phase-numbers">
                        <option value="0"/>
                        <option value="90"/>
                        <option value="180"/>
                        <option value="270"/>
                    </datalist>
                </div>
            </div>
        );
    }
}

export default Oscillator;
