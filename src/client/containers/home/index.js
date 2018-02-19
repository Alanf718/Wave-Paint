import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ActionCreators} from './actions/index';
import {WaveForm} from './components/wave-form';
import {Oscillator} from './components/wave-form/oscillator';
import {AudioIn} from './components/wave-form/audio-in';

import './style.scss';
export class Home extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const {audio} = this.props;
        return (
            <div id="entry">
                <WaveForm id="wave-ref"/>
                <AudioIn
                    audio={audio}
                    id="wave-in-ref"
                    url="./A4.mp3"/>
                <Oscillator
                    audio={audio}
                    id="wave-osc-1"
                    frequency={440}
                    phase={0}
                    amplitude={0.5}
                    duration={2}/>
                <button id="play-reference" onClick={this.props.debug1}>Play Reference</button>
                <button id="play-output">Play Output</button>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return { audio: state.config.audio };
};

const mapDispatchToProps = (dispatch) => (bindActionCreators({...ActionCreators}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Home);
