import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ActionCreators} from './actions/index';
import {WaveForm} from './components/wave-form';
import {Oscillator} from './components/wave-form/oscillator';
import {AudioIn} from './components/wave-form/audio-in';
import {mouse, keys} from 'gocanvas';

import './style.scss';
export class Home extends Component {

    constructor(props) {
        super(props);
    }

    /* eslint-disable */
    onInput(evt) {
        const {state, window} = this.props;
        const {key, dt, event} = evt;
        const timeSpan = state.tMax - state.tMin;

        switch(key) {
        case 'a':
            if(event === 'held') {
                state.tMin -= dt * timeSpan;
                state.tMax -= dt * timeSpan;
            }
            break;
        case 'd':
            if(event === 'held') {
                state.tMin += dt * timeSpan;
                state.tMax += dt * timeSpan;
            }
            break;
        case 'w':
            if(event === 'held') {
                state.tMin += dt * timeSpan;
                state.tMax -= dt * timeSpan;
            }
            break;
        case 's':
            if(event === 'held') {
                state.tMin -= dt * timeSpan;
                state.tMax += dt * timeSpan;
            }
            break;
        default:
            break;
        }
    }

    loadAndDisplay() {
        const {audio, url} = this.props;

        if(!this.buffer) {
            audio.load(url).then(buffer => {
                this.buffer = buffer;
            });
        }
    }

    componentDidMount() {
        this.keySubscription = keys(document).subscribe(evt => this.onInput(evt));
        this.mouseSubscription = mouse(document).subscribe(console.log);
    }

    // called on any updated renders
    componentDidUpdate() {
        this.mouseSubscription.unsubscribe();
        this.keySubscription.unsubscribe();
        this.keySubscription = keys(document).subscribe(evt => this.onInput(evt));
        this.mouseSubscription = mouse(document).subscribe(console.log);
    }

    componentWillUnmount() {
        this.mouseSubscription.unsubscribe();
        this.keySubscription.unsubscribe();
    }

    render() {
        const {config: {audio, refAudio}, loadAudio} = this.props;
        /* eslint-disable */
        // reference audio hasn't loaded yet
        if(!refAudio) {
            loadAudio(audio, './A4.mp3');
            return (
                <div>
                    Loading Reference Audio
                </div>
            );
        } else {
            const duration = refAudio.duration;
            return (
                <div id="entry">
                    <WaveForm id="wave-ref"/>
                    <AudioIn
                        audio={audio}
                        id="waveform-ref"
                        refAudio={refAudio}
                        url="./A4.mp3"/>
                    <Oscillator
                        audio={audio}
                        slot={1}
                        frequency={440}
                        phase={0}
                        amplitude={0.5}
                        duration={duration}/>
                    <button id="play-reference" onClick={this.props.debug1}>Play Reference</button>
                    <button id="play-output">Play Output</button>
                </div>

            );
        }
    }
}

const mapStateToProps = (state) => {
    return {...state};
};

const mapDispatchToProps = (dispatch) => (bindActionCreators({...ActionCreators}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Home);
