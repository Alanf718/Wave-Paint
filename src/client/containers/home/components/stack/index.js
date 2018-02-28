import React, {Component} from 'react';

import './style.scss';

export class Stack extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const {stack} = this.props;
        return (
            <div className="stack" id={`stack-${stack}`}>
                Test
            </div>
        );
    }
}

export default Stack;
