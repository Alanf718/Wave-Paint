/* eslint-disable */
const {mouse} = require('gocanvas');

export class Display {
    constructor(canvas) {
        this.canvas = canvas;
    }

    renderBuffer(buffer, {tMin = 0, tMax = buffer.duration, yScale = 1, selectedtMin, selectedtMax}) {
        const {canvas} = this;
        const {width, height} = canvas;
        const {floor, ceil} = Math;
        const {sampleRate} = buffer;
        let ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, width, height);
        // we only render the first channel
        let nowBuffering = buffer.getChannelData(0);
        const i0 = floor(tMin*sampleRate);
        const iF = ceil(tMax*sampleRate);

        const sTotal = iF - i0;

        let cursor = 0;
        ctx.beginPath();
        console.log(i0, iF);
        for (let i = i0; i < iF - 1; i++) {
            const x = floor(cursor*(width/sTotal));
            const y = floor((-nowBuffering[i])*height/2 * yScale + height/2);
            const x2 = floor((cursor+1)*(width/sTotal));
            const y2 = floor((-nowBuffering[i+1])*height/2 * yScale + height/2);
            if(i === i0) {
                ctx.moveTo(x,y);
                ctx.lineTo(x2,y2);
            } else {
                ctx.lineTo(x2,y2);
            }
            cursor++;
        }
        ctx.stroke();

        this._renderSelection(ctx, {tMin, tMax, selectedtMin, selectedtMax, width, height});
    }

    _renderSelection(ctx, {tMin, tMax, selectedtMin, selectedtMax, width, height}) {
        if(selectedtMin && selectedtMax) {
            ctx.fillStyle = 'rgba(255, 0, 0, .5)';
            const x1 = (selectedtMin - tMin) / (tMax - tMin) * width;
            const x2 = (selectedtMax - tMin) / (tMax - tMin) * width;
            ctx.fillRect(x1, 0, (x2-x1), height);
        }
    }
};
