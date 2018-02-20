import React, {Component} from 'react';
import {Display} from '../../../../../../wave/display';
import './style.scss';

export class AudioIn extends Component {

    constructor(props) {
        super(props);
    }

    playBuffer() {
        const {audio, refAudio} = this.props;
        audio.play(refAudio);
    }

    displayWaveform() {
        const {refAudio, window} = this.props;

        if(refAudio) {
            const display = new Display(this.refs.canvas);
            display.renderBuffer(refAudio, window);
        }
    }

    componentDidMount() {
        this.displayWaveform();
    }

    componentDidUpdate() {
        this.displayWaveform();
    }

    render() {
        const {id, url} = this.props;

        return (
            <div className="wave-form audio-in" id={id}>
                <div className="menu-bar">
                    <span className="label">AudioData ({url}) </span>
                    <span className="operation"><i>+</i></span>
                </div>
                <div>
                    <canvas width="800" height="150" ref="canvas"/>
                </div>
                <div className="menu-bar">
                    <button onClick={() => {this.playBuffer();}}>play</button>
                </div>
            </div>
        );
    }
}

export default AudioIn;
