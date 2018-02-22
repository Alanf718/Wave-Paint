import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ActionCreators as homeActions} from './actions/index';
import {ActionCreators as waveActions} from './components/wave-form/actions';
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
    }
    componentWillUnmount() {
        this.keySubscription.unsubscribe();
    }

    playOutput() {
        const {config: {audio, refAudio}, slots} = this.props;
        const duration = refAudio.duration;

        const output = slots.reduce((acc, slot) => {
            const {params: {frequency, overtone, phase, amplitude}, type} = slot;
            if(type === 'osc') {
                const osc = audio.createOscillator({frequency: frequency * (overtone + 1), amplitude, phase, duration});
                return audio.sum({buffer1: acc, buffer2: osc});
            }
            return acc;
        }, audio.createEmpty({duration}));

        audio.play(output);

    }

    render() {
        const {config: {audio, refAudio, window}, slots, loadAudio, update, add} = this.props;

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
                {
                    slots.map(({type, params}, i) => {
                        if(type === 'osc') {
                            return (
                                <Oscillator
                                    audio={audio}
                                    slot={i}
                                    key={i}
                                    frequency={params.frequency}
                                    overtone={params.overtone}
                                    phase={params.phase}
                                    amplitude={params.amplitude}
                                    duration={duration}
                                    window={window}
                                    update={update}/>
                            );
                        }

                        return (
                            <div>
                                Unknown Slot Type
                            </div>
                        );
                    })
                }
                <button id="add-waveform"
                    onClick={() => add({frequency: 440, overtone: 0, phase: 0, amplitude: 0.125})}>
                    Add Oscillator
                </button>
                <button id="play-output" onClick={() => this.playOutput()}>Play Output</button>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {...state};
};

const mapDispatchToProps = (dispatch) => (bindActionCreators({
    ...homeActions,
    ...waveActions,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Home);
