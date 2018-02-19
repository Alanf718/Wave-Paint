import React, {Component} from 'react';
import {mouse, CanvasQL} from 'gocanvas';

import './style.scss';

export class RegionSelector extends Component {

    constructor(props) {
        super(props);
    }

    /* eslint-disable */
    onMouseInput(evt) {
        const {pos, type/*, button*/} = evt;
        const {canvas, start} = this;
        canvas.primitive().clear();

        switch(type) {
            case 'press': {
                this.start = pos;
                break;
            }
            case 'drag': {
                this.size = {
                    x: pos.x - start.x,
                    y: pos.y - start.y
                };
                canvas
                    .primitive()
                    .rect()
                    .color('rgba(255, 0, 0, .5)')
                    .at(start.x, start.y)
                    .size(this.size.x, this.size.y)
                    .go();
            }
            case 'release': {
                this.size = {
                    x: pos.x - start.x,
                    y: pos.y - start.y
                };
                canvas
                    .primitive()
                    .rect()
                    .color('rgba(255, 0, 0, .5)')
                    .at(start.x, start.y)
                    .size(this.size.x, this.size.y)
                    .go();
            }
        }
    }

    // called on first render
    componentDidMount() {
        const domElement = document.querySelector('.display');
        const cql = CanvasQL('.display canvas');
        cql.primitive().clear();
        cql.primitive().rect().at(10, 20).size(32, 32).go();

        this.canvas = cql;
        this.mouseSubscription = mouse(domElement).subscribe(evt => this.onMouseInput(evt));
    }

    // called on any updated renders
    componentDidUpdate() {
        this.mouseSubscription.unsubscribe();
        const domElement = document.querySelector('.display');
        this.mouseSubscription = mouse(domElement).subscribe(evt => this.onMouseInput(evt));
    }

    componentWillUnmount() {
        this.mouseSubscription.unsubscribe();
    }

    render() {
        return (
            <div className="display">
                <canvas width="640" height="480"/>
            </div>
        );
    }
}

export default RegionSelector;
