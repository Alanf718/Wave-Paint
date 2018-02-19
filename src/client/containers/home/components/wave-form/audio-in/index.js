import React, {Component} from 'react';
import {Display} from '../../../../../../wave/display';
import './style.scss';

export class AudioIn extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {audio, url} = this.props;

        audio.load(url).then(buffer => {
            const display = new Display(this.refs.canvas);
            display.renderBuffer(buffer, {tMin: 0.03, tMax: 0.05});
        });
    }

    componentDidUpdate() {
        const {audio, url} = this.props;

        audio.load(url).then(buffer => {
            const display = new Display(this.refs.canvas);
            display.renderBuffer(buffer, {tMin: 0.10, tMax: 0.13});
        });
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
                    <span className="freq">440hz</span>
                    <span className="phase">45°</span>
                </div>
            </div>
        );
    }
}

export default AudioIn;
