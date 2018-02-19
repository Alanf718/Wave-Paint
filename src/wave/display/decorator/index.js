/* eslint-disable */
export class Decorator {
    constructor(canvas) {
        this.canvas = canvas;
    }

    decorate(buffer, {tMin, tMax, yScale}) {
        const {canvas} = this;
        const {width, height} = canvas;
        const {floor, ceil} = Math;
        const {sampleRate} = buffer;
        let ctx = canvas.getContext("2d");

        // we only render the first channel
        let nowBuffering = buffer.getChannelData(0);
        const i0 = floor(tMin*sampleRate);
        const iF = ceil(tMax*sampleRate);

        const sTotal = iF - i0;

        let cursor = 0;
        console.log(`\t${(iF-i0)} ${width/(iF-i0)}`);
        const ratio = width/(iF-i0);

        // ratio 8 = full samples
        // ratio 0.65 = 1 out of 8 samples
        if(ratio > 8) {
            ctx.strokeStyle='rgba(255, 0, 0, 1)';
            ctx.beginPath();
            for (let i = i0; i < iF - 1; i++) {
                const x = floor(cursor * (width / sTotal));
                const y = floor((-nowBuffering[i]) * height / 2 * yScale + height / 2);
                ctx.moveTo(x - 5, y);
                ctx.lineTo(x + 5, y);
                ctx.moveTo(x, y - 5);
                ctx.lineTo(x, y + 5);
                cursor++;
            }
            ctx.stroke();
        }
    }
};
