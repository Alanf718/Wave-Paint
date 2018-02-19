import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ActionCreators} from './actions/index';
import {RegionSelector} from './components/region-selector';
import {SelectedRegion} from './components/selected-region';

import './style.scss';
/* eslint-disable no-unused-vars */
const selected = {
    regionSelected: [
        {x: 0, y: 0},
        {x: 32, y: 32}
    ],
    tags: []
};
/* eslint-enable */

export class Home extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        // const {debug1} = this.props;

        return (
            <div className="frame-tags">
                <RegionSelector/>
                <SelectedRegion selected={['Im an array!']}/>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return { view: state };
};

const mapDispatchToProps = (dispatch) => (bindActionCreators({...ActionCreators}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Home);
