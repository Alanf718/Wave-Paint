import React, {Component} from 'react';
import './style.scss';
const d3 = require('d3');

export class Envelope extends Component {

    constructor(props) {
        super(props);
    }

    toSvgSpace(envelope) {
        const width = parseInt(this.refs.svg.getAttribute('width'), 10);
        const height = parseInt(this.refs.svg.getAttribute('height'), 10);

        const transformed = envelope.map(point => {
            return {x: point.x * width, y: height * (1 - point.y), name: point.name};
        });

        return transformed;
    }

    toNormalSpace(envelope) {
        const width = parseInt(this.refs.svg.getAttribute('width'), 10);
        const height = parseInt(this.refs.svg.getAttribute('height'), 10);

        const transformed = envelope.map(point => {
            return {x: point.x / width, y: (height - point.y) / height, name: point.name};
        });

        return transformed;
    }

    drawCurve(points) {
        const {slot} = this.props;
        const svg = d3.select(`#waveform-${slot} div svg`);
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

    displayWaveform() {
        const {attack, decay, release, sustain, update, slot} = this.props;

        const envelope = [
            {x: 0, y: 0, name: 'start'},
            {...attack, name: 'attack'},
            {...decay, name: 'decay'},
            {...release, name: 'release'},
            {...sustain, name: 'sustain'}
        ];

        const points = this.toSvgSpace(envelope);

        /* eslint-disable func-style */
        function dragstarted() {
            d3.select(this).raise().classed('active', true);
        }

        const self = this;
        function dragged(d) {
            d3.select(this)
                .attr('cx', d.x = d3.event.x)
                .attr('cy', d.y = d3.event.y);

            self.drawCurve(points);
        }

        function dragended() {
            d3.select(this).classed('active', false);
            const newEnvelope = self.toNormalSpace(points);

            update({slot,
                attack: newEnvelope[1],
                decay: newEnvelope[2],
                release: newEnvelope[3],
                sustain: newEnvelope[4]
            });
        }
        /* eslint-enable func-style */

        const svg = d3.select(`#waveform-${slot} div svg`);

        svg.selectAll('circle').remove();

        const circles = svg.selectAll('circle')
            .data(points);

        circles
            .enter()
            .append('circle')
            .attr('cx', p => p.x)
            .attr('cy', p => p.y)
            .attr('r', 8)
            .attr('name', p => p.name)
            .call(
                d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended)
            );

        circles.exit().remove();

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
                    <svg width="500" height="150" ref="svg">
                        <g className="curve"/>
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
