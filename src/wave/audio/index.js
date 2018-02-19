export class Audio {
    constructor(audioCtx) {
        this.actx = audioCtx;
    }

    load(url) {
        const {actx} = this;
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        return new Promise((resolve, reject) => {
            request.onload = function() {
                let audioData = request.response;
                actx.decodeAudioData(audioData)
                    .then((buffer) => {
                        resolve(buffer);
                    })
                    .catch(e => {
                        reject(e.err);
                    });
            };

            request.send();
        });
    }

    play(buffer) {
        const {actx} = this;
        const source = actx.createBufferSource();
        source.buffer = buffer;
        source.connect(actx.destination);
        source.start();
    }

    createOscillator({frequency, phase, amplitude, duration}) {
        const {actx} = this;
        let myArrayBuffer = actx.createBuffer(1, actx.sampleRate * duration, actx.sampleRate);
        const sampleRate = 1 / actx.sampleRate;

        for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {

            let nowBuffering = myArrayBuffer.getChannelData(channel);
            for (let i = 0; i < myArrayBuffer.length; i++) {
                const t = i * sampleRate * Math.PI * 2;
                const sample = Math.sin(t * frequency + phase) * amplitude;
                nowBuffering[i] = sample;
            }
        }

        return myArrayBuffer;
    }
}
