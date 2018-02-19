import React, {Component} from 'react';
import {Display} from '../../../../../../wave/display';
import './style.scss';

export class AudioIn extends Component {

    constructor(props) {
        super(props);
    }

    playBuffer() {
        const {props: {audio}, buffer} = this;
        audio.play(buffer);
    }

    loadAndDisplay() {
        const {audio, url} = this.props;

        if(!this.buffer) {
            audio.load(url).then(buffer => {
                this.buffer = buffer;
                const display = new Display(this.refs.canvas);
                display.renderBuffer(buffer, {tMin: 0.03, tMax: 0.05});
            });
        }
    }

    componentDidMount() {
        this.loadAndDisplay();
    }

    componentDidUpdate() {
        this.loadAndDisplay();
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
