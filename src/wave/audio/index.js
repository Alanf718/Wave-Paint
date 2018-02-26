export class Audio {
    constructor(audioCtx) {
        this.actx = audioCtx;
    }

    createEmpty({duration}) {
        const {actx, actx: {sampleRate}} = this;
        return actx.createBuffer(1, sampleRate * duration, sampleRate);
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

    sum({buffer1, buffer2}) {
        const totalSeconds = buffer1.duration;
        const sum = this.createEmpty({duration: totalSeconds});

        for (let channel = 0; channel < buffer1.numberOfChannels; channel++) {
            const sumBuffering = sum.getChannelData(channel);
            var nowBuffering1 = buffer1.getChannelData(channel);
            var nowBuffering2 = buffer2.getChannelData(channel);
            for (let i = 0; i < sumBuffering.length; i++) {
                sumBuffering[i] = nowBuffering1[i] + nowBuffering2[i];
            }
        }

        return sum;
    }

    product({buffer1, buffer2}) {
        const totalSeconds = buffer1.duration;
        const sum = this.createEmpty({duration: totalSeconds});

        for (let channel = 0; channel < buffer1.numberOfChannels; channel++) {
            const sumBuffering = sum.getChannelData(channel);
            var nowBuffering1 = buffer1.getChannelData(channel);
            var nowBuffering2 = buffer2.getChannelData(channel);
            for (let i = 0; i < sumBuffering.length; i++) {
                sumBuffering[i] = nowBuffering1[i] * nowBuffering2[i];
            }
        }

        return sum;
    }

    /**
     * @param {float} frequency Oscillator Frequency
     * @param {float} phase Oscillator phase in degrees
     * @param {float} amplitude Oscillator amplitude [0, 1]
     * @param {float} duration Oscillator duration in seconds
     * @returns {AudioBuffer} audio buffer
     */
    createOscillator({frequency, phase, amplitude, duration}) {
        const {actx} = this;
        let myArrayBuffer = this.createEmpty({duration});
        const sampleRate = 1 / actx.sampleRate;
        const PI2 = Math.PI * 2;

        for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {

            let nowBuffering = myArrayBuffer.getChannelData(channel);
            for (let i = 0; i < myArrayBuffer.length; i++) {
                const t = i * sampleRate * PI2;
                const sample = Math.sin(t * frequency + (phase * PI2 / 360)) * amplitude;
                nowBuffering[i] = sample;
            }
        }

        return myArrayBuffer;
    }

    /* eslint-disable */
    // @todo make this robust instead of static amplitude
    createEnvelope({duration, attack, decay, release, sustain}) {
        let myArrayBuffer = this.createEmpty({duration});
        for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {

            let nowBuffering = myArrayBuffer.getChannelData(channel);
            let i = 0;
            const attackEnd = Math.floor(myArrayBuffer.length * attack.x);
            const decayEnd = Math.floor(myArrayBuffer.length * decay.x);
            const releaseEnd = Math.floor(myArrayBuffer.length * release.x);
            const sustainEnd = Math.floor(myArrayBuffer.length * sustain.x);

            let y0 = 0;
            for (; i < attackEnd; i++) {
                const t = i / attackEnd;
                nowBuffering[i] = y0 * (1 - t) + attack.y * t;
            }
            y0 = attack.y;
            for (; i < decayEnd; i++) {
                const t = (i - attackEnd) / (decayEnd - attackEnd);
                nowBuffering[i] = y0 * (1 - t) + decay.y * t;
            }
            y0 = decay.y;
            for (; i < releaseEnd; i++) {
                const t = (i - decayEnd) / (releaseEnd - decayEnd);
                nowBuffering[i] = y0 * (1 - t) + release.y * t;
            }
            y0 = release.y;
            for (; i < sustainEnd; i++) {
                const t = (i - releaseEnd) / (sustainEnd - releaseEnd);
                nowBuffering[i] = y0 * (1 - t) + sustain.y * t;
            }

        }

        return myArrayBuffer;
    }
}
