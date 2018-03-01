import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ActionCreators as homeActions} from './actions/index';
import {ActionCreators as waveActions} from './components/wave-form/actions';
import {ActionCreators as stackActions} from './components/stack/actions';
import {Stack} from './components/stack';
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
        const {config: {audio, refAudio, window}, stacks, loadAudio, update, add, expand, addStack} = this.props;

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
                <AudioIn
                    audio={audio}
                    id="waveform-ref"
                    refAudio={refAudio}
                    url="./A4.mp3"
                    window={window}
                />
                <button onClick={() => addStack()}>Add Stack</button>
                <div className="stacks">
                    {
                        stacks.map((stack, stackId) => {
                            const {slots} = stack;
                            return (
                                <Stack stack={stackId}
                                    window={window}
                                    audio={audio}
                                    duration={duration}
                                    slots={slots}
                                    key={stackId}
                                    actions={{add}}>
                                    {
                                        slots.map(({type, expanded, params}, i) => {
                                            if (type === 'osc') {
                                                return (
                                                    <Oscillator
                                                        audio={audio}
                                                        stack={stackId}
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
                                            } else if (type === 'env') {
                                                return (
                                                    <Envelope
                                                        audio={audio}
                                                        stack={stackId}
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
                                </Stack>
                            );
                        })
                    }
                </div>
                <Output
                    audio={audio}
                    slots={stacks.map(stack => stack.slots)}
                    duration={duration}
                    width={1018}
                    window={window}/>
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
    ...stackActions
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Home);
