import React, {Component} from 'react';
// import {Display} from '../../../../../../wave/display';
import './style.scss';
// import * as d3 from 'd3';
const d3 = require('d3');

export class Envelope extends Component {

    constructor(props) {
        super(props);
    }

    /*eslint-disable */
    toSvgSpace(envelope) {
        const width = parseInt(this.refs.svg.getAttribute('width'));
        const height = parseInt(this.refs.svg.getAttribute('height'));

        const transformed = envelope.map(point => {
            return {x: point.x * width, y: height * (1 - point.y), name: point.name};
        });

        return transformed;
    }

    toNormalSpace(envelope) {
        const width = parseInt(this.refs.svg.getAttribute('width'));
        const height = parseInt(this.refs.svg.getAttribute('height'));

        const transformed = envelope.map(point => {
            return {x: point.x / width, y: height / (1 - point.y), name: point.name};
        });

        return transformed;
    }

    drawCurve(points) {
        const svg = d3.select('svg');
        const group = svg.select('g.curve');

        const fullEnvelope = d3.pairs(points);

        const buildPath = pair => {
            const path = d3.path();
            path.moveTo(pair[0].x, pair[0].y);
            path.lineTo(pair[1].x, pair[1].y);
            return path;
        };

        group.selectAll('path').remove();

        const paths = group.selectAll('path')
            .data(fullEnvelope);

        paths.enter()
            .append('path')
            .attr('d', buildPath)
            .attr('stroke', 'black')
            .attr('stroke-width', 1);


        paths.exit().remove();
    }

    /* eslint-disable */
    displayWaveform() {
        const {attack, decay, release, sustain, update} = this.props;

        const envelope = [
            {x: 0, y: 0, name: 'start'},
            {...attack, name: 'attack'},
            {...decay, name: 'decay'},
            {...release, name: 'release'},
            {...sustain, name: 'sustain'}
        ];
        const points = this.toSvgSpace(envelope);

        function dragstarted() {
            d3.select(this).raise().classed('active', true);
        }

        const self = this;
        function dragged(d) {
            // console.log(this, this.getAttribute('name'));
            d3.select(this)
                .attr('cx', d.x = d3.event.x)
                .attr('cy', d.y = d3.event.y);

            self.drawCurve(points);
        }

        function dragended() {
            d3.select(this).classed('active', false);
            console.log(points);
        }

        const svg = d3.select('svg');

        const circles = svg.selectAll('circle')
            .data(points)
            .enter()
            .append('circle');

        circles.attr('cx', p => p.x)
            .attr('cy', p => p.y)
            .attr('r', 4)
            .attr('name', p => p.name)
            .call(
                d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended)
            );

        this.drawCurve(points);
    }

    componentDidMount() {
        this.displayWaveform();
    }

    componentDidUpdate() {
        this.displayWaveform();
    }

    render() {
        const {slot} = this.props;
        return (
            <div className="wave-form envelope" id={`waveform-${slot}`}>
                <div className="menu-bar">
                    <span className="label">Envelope</span>
                    <span className="operation"><i>*</i></span>
                </div>
                <div>
                    <svg width="800" height="150" ref="svg">
                        <g className="curve">
                        </g>
                    </svg>
                </div>
                <div className="menu-bar">
                    &nbsp;
                </div>
            </div>
        );
    }
}

export default Envelope;
