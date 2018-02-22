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

    /*
    product({buffer1, buffer2}) {
        const {actx} = this;
        const totalSeconds = buffer1.duration;
        const sum = createEmptyBuffer(actx, totalSeconds);

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
    */

    createOscillator({frequency, phase, amplitude, duration}) {
        const {actx} = this;
        // let myArrayBuffer = actx.createBuffer(1, actx.sampleRate * duration, actx.sampleRate);
        let myArrayBuffer = this.createEmpty({duration});
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
