import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ActionCreators as homeActions} from './actions/index';
import {ActionCreators as waveActions} from './components/wave-form/actions';
import {WaveForm} from './components/wave-form';
import {Oscillator} from './components/wave-form/oscillator';
import {AudioIn} from './components/wave-form/audio-in';
import {Output} from './components/wave-form/output';
import {Envelope} from './components/wave-form/envelope/index';
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

    render() {
        const {config: {audio, refAudio, window}, slots, loadAudio, update, add, expand} = this.props;

        if(!refAudio) {
            loadAudio(audio, './A4.mp3');
            return (
                <div>
                    Loading Reference Audio
                </div>
            );
        }

        const duration = refAudio.duration;
        // @todo we can reduce the number of properties sent by grouping ...actions and ...params
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
                    slots.map(({type, expanded, params}, i) => {
                        if(type === 'osc') {
                            return (
                                <Oscillator
                                    audio={audio}
                                    slot={i}
                                    key={i}
                                    expanded={expanded}
                                    frequency={params.frequency}
                                    overtone={params.overtone}
                                    phase={params.phase}
                                    amplitude={params.amplitude}
                                    expand={expand}
                                    duration={duration}
                                    window={window}
                                    update={update}/>
                            );
                        } else if(type === 'env') {
                            return (
                                <Envelope
                                    audio={audio}
                                    slot={i}
                                    key={i}
                                    window={window}
                                    update={update}
                                    attack={params.attack}
                                    decay={params.decay}
                                    release={params.release}
                                    sustain={params.sustain}
                                />
                            );
                        }

                        return (
                            <div>
                                Unknown Slot Type
                            </div>
                        );
                    })
                }
                <Output
                    audio={audio}
                    slots={slots}
                    duration={duration}
                    window={window}/>
                <button id="add-waveform"
                    onClick={() => add({
                        type: 'osc',
                        frequency: 440,
                        overtone: 0,
                        phase: 0,
                        amplitude: 0.125
                    })}>
                    Add Oscillator
                </button>
                <button id="add-envelope"
                    onClick={() => add({
                        type: 'env',
                        attack: {x: 0.3, y: 1},
                        decay: {x: 0.4, y: 0.5},
                        release: {x: 0.9, y: 0.5},
                        sustain: {x: 1, y: 0}
                    })}>
                    Add Envelope
                </button>
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
