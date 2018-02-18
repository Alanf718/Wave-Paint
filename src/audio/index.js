/* eslint-disable */
export class Audio {
    constructor(audioCtx) {
        this.actx = audioCtx;
    }

    play(buffer) {
        const {actx} = this;
        const source = actx.createBufferSource();
        source.buffer = buffer;
        source.connect(actx.destination);
        source.start();
    }
};
