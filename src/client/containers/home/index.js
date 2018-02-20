import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ActionCreators} from './actions/index';
import {WaveForm} from './components/wave-form';
import {Oscillator} from './components/wave-form/oscillator';
import {AudioIn} from './components/wave-form/audio-in';
import {/*mouse,*/ keys} from 'gocanvas';

import './style.scss';
export class Home extends Component {

    constructor(props) {
        super(props);
    }

    /* eslint-disable complexity */
    onInput(evt) {
        const {config: {window}, windowing} = this.props;
        const {key, dt, event} = evt;
        const timeSpan = window.tMax - window.tMin;

        switch(key) {
        case 'a':
            if(event === 'held') {
                windowing({
                    tMin: window.tMin - dt * timeSpan,
                    tMax: window.tMax - dt * timeSpan
                });
            }
            break;
        case 'd':
            if(event === 'held') {
                windowing({
                    tMin: window.tMin + dt * timeSpan,
                    tMax: window.tMax + dt * timeSpan
                });
            }
            break;
        case 'w':
            if(event === 'held') {
                windowing({
                    tMin: window.tMin + dt * timeSpan,
                    tMax: window.tMax - dt * timeSpan
                });
            }
            break;
        case 's':
            if(event === 'held') {
                windowing({
                    tMin: window.tMin - dt * timeSpan,
                    tMax: window.tMax + dt * timeSpan
                });
            }
            break;
        default:
            break;
        }
    }

    componentDidMount() {
        this.keySubscription = keys(document).subscribe(evt => this.onInput(evt));
        // this.mouseSubscription = mouse(document).subscribe(console.log);
    }

    // called on any updated renders
    componentDidUpdate() {
        /* this is causing issues to unsubscribe and resubscribe on component update */
        // this.mouseSubscription.unsubscribe();
        // this.keySubscription.unsubscribe();
        // this.keySubscription = keys(document).subscribe(evt => this.onInput(evt));
        // this.mouseSubscription = mouse(document).subscribe(console.log);
    }

    componentWillUnmount() {
        this.mouseSubscription.unsubscribe();
        this.keySubscription.unsubscribe();
    }

    render() {
        const {config: {audio, refAudio, window}, loadAudio} = this.props;

        if(!refAudio) {
            loadAudio(audio, './A4.mp3');
            return (
                <div>
                    Loading Reference Audio
                </div>
            );
        }

        const duration = refAudio.duration;
        return (
            <div id="entry">
                <WaveForm id="wave-ref"/>
                <AudioIn
                    audio={audio}
                    id="waveform-ref"
                    refAudio={refAudio}
                    url="./A4.mp3"
                    window={window}
                />
                <Oscillator
                    audio={audio}
                    slot={1}
                    frequency={440}
                    phase={0}
                    amplitude={0.125}
                    duration={duration}
                    window={window}
                />
                <button id="play-reference">Play Reference</button>
                <button id="play-output">Play Output</button>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {...state};
};

const mapDispatchToProps = (dispatch) => (bindActionCreators({...ActionCreators}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Home);
