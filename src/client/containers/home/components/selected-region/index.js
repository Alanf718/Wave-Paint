import React, {Component} from 'react';

import './style.scss';

export class SelectedRegion extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const {selected} = this.props;

        return (
            <div className="display zoomed-display">
                <canvas width="320" height="320"/>
                <div className="tool-bar">
                    <button>Save Region</button>
                    <button>Add Line</button>
                    <button>Add Point</button>
                    <pre id="remove-later">
                        {selected}
                    </pre>
                </div>
            </div>
        );
    }
}

export default SelectedRegion;
