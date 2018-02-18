/* eslint-disable */

const {Display} = require('./display');
const {mouse} = require('gocanvas');
const noise = require('./perlin');

const createEmptyBuffer = (audioCtx, seconds) => {
	return audioCtx.createBuffer(1, audioCtx.sampleRate * seconds, audioCtx.sampleRate);
};

const getAudioData = (ac, url) => {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

	return new Promise((resolve, reject) => {
		request.onload = function() {
			var audioData = request.response;
			ac.decodeAudioData(audioData)
				.then((buffer) => {
					resolve(buffer);
				})
				.catch( e => {
					reject(e.err);
				});
		}

		request.send();
	});
};
/** must have same number of channels, samplerate, and length */
const sum = (audioCtx, buffer1, buffer2) => {
	const totalSeconds = buffer1.duration;
	const sum = createEmptyBuffer(audioCtx, totalSeconds);

	for (let channel = 0; channel < buffer1.numberOfChannels; channel++) {
		const sumBuffering = sum.getChannelData(channel);
		var nowBuffering1 = buffer1.getChannelData(channel);
		var nowBuffering2 = buffer2.getChannelData(channel);
		for (let i = 0; i < sumBuffering.length; i++) {
			sumBuffering[i] = nowBuffering1[i] + nowBuffering2[i];
		}
	}
	
	return sum;
};

const interpolate = (audioCtx, buffer1, buffer2, timeSpan, blendLeft, blendRight) => {
	const totalSeconds = buffer1.duration;
	const merge = createEmptyBuffer(audioCtx, totalSeconds);
	const sampleRate = 1/merge.sampleRate;

	for (let channel = 0; channel < buffer1.numberOfChannels; channel++) {
		const mergeBuffering = merge.getChannelData(channel);
		var nowBuffering1 = buffer1.getChannelData(channel);
		var nowBuffering2 = buffer2.getChannelData(channel);
		for (let i = 0; i < mergeBuffering.length; i++) {
			const t = i*sampleRate;
			const z = t/timeSpan > 1 ? 1 : t/timeSpan;
			mergeBuffering[i] = (1-z)*nowBuffering1[i]*blendLeft + z*nowBuffering2[i]*blendRight;
		}
	}
	
	return merge;
};

const product = (audioCtx, buffer1, buffer2) => {
	const totalSeconds = buffer1.duration;
	const sum = createEmptyBuffer(audioCtx, totalSeconds);

	for (let channel = 0; channel < buffer1.numberOfChannels; channel++) {
		const sumBuffering = sum.getChannelData(channel);
		var nowBuffering1 = buffer1.getChannelData(channel);
		var nowBuffering2 = buffer2.getChannelData(channel);
		for (let i = 0; i < sumBuffering.length; i++) {
			sumBuffering[i] = nowBuffering1[i] * nowBuffering2[i];
		}
	}
	
	return sum;
};

const createPerlinBuffer = (audioCtx, seed, factor, slice, seconds) => {
	noise.seed(seed);
	
	const perlin = createEmptyBuffer(audioCtx, seconds);
	const sampleRate = 1/perlin.sampleRate;
	for (let channel = 0; channel < perlin.numberOfChannels; channel++) {		
		const perlinBuffer = perlin.getChannelData(channel);
		for (let i = 0; i < perlinBuffer.length; i++) {
			const t = i*sampleRate*Math.PI*2;
			const v = noise.perlin2(t/(sampleRate*factor), slice);
			perlinBuffer[i] = v;
		}
		// console.log(perlinBuffer);
	}
	
	return perlin;
};

const linearGain = (audioCtx, from, to, duration, totalSeconds) => {
	const buffer = createEmptyBuffer(audioCtx, totalSeconds);
	
	const sampleTo = Math.floor(duration*buffer.sampleRate);
	const m = (to-from)/sampleTo;
	for (var channel = 0; channel < buffer.numberOfChannels; channel++) {
		var myArrayBuffer = buffer.getChannelData(channel);
		for (var i = 0; i < myArrayBuffer.length; i++) {
			const val = from + m*i;
			if(i >= sampleTo) {
				myArrayBuffer[i] = to;
			} else {
				myArrayBuffer[i] = val;
			}
		}
	}
	
	return buffer;
};

const createNoiseBuffer = (audioCtx, seconds) => {
	var myArrayBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * seconds, audioCtx.sampleRate);

	for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
		var nowBuffering = myArrayBuffer.getChannelData(channel);
		for (var i = 0; i < myArrayBuffer.length; i++) {
			nowBuffering[i] = Math.random() * .2 - 1;
		}
	}
	
	return myArrayBuffer;
}

const createOscillatorBuffer = (audioCtx, freq, phase, amp, seconds) => {
	var myArrayBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * seconds, audioCtx.sampleRate);
	const sampleRate = 1/audioCtx.sampleRate;

	for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {

		var nowBuffering = myArrayBuffer.getChannelData(channel);
		for (var i = 0; i < myArrayBuffer.length; i++) {
			const t = i*sampleRate*Math.PI*2;
			const sample = Math.sin(t*freq + phase)*amp;
			nowBuffering[i] = sample;
		}
	}
	
	return myArrayBuffer;
}

const playBuffer = (audioCtx, buffer) => {
	var source = audioCtx.createBufferSource();
	source.buffer = buffer;
	source.connect(audioCtx.destination);
	source.start();
}

noise.seed(321);

var canvas = document.getElementById("display");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var ctx = canvas.getContext("2d");
var canvasData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
function drawPixel (x, y, r, g, b, a) {
		var index = (x + y * canvasWidth) * 4;
		canvasData.data[index + 0] = r;
		canvasData.data[index + 1] = g;
		canvasData.data[index + 2] = b;
		canvasData.data[index + 3] = a;
}

const totalSeconds = 2;
var actx = new (window.AudioContext || window.webkitAudioContext)();

getAudioData(actx, './A4.mp3').then(buffer => {
	const mainDisplay = new Display(canvas);
	const currRenderState = {tMin: 0.00, tMax: buffer.duration, yScale: 3}
	mainDisplay.renderBuffer(buffer, currRenderState);

    // mouse(canvas).subscribe(evt => this.onMouseInput(evt, {tMin, tMax, width, height}));
    mouse(canvas).subscribe(evt => {
		const {type, pos} = evt;
		const {width, height} = canvas;
		const {tMin, tMax} = currRenderState;
		const tWidth = tMax - tMin;
		const t = tMin + (pos.x / width) * tWidth;
		// console.log(evt, type);
		switch(type) {
			case 'drag': {
                currRenderState.selectedtMax = t;
			} break;
			case 'press': {
				currRenderState.selectedtMin = t;
			} break;
			case 'release': {
				currRenderState.tMin = currRenderState.selectedtMin;
				currRenderState.tMax = t;

                delete currRenderState.selectedtMin;
                delete currRenderState.selectedtMax;
			} break;
			default:
				break;
		}
        mainDisplay.renderBuffer(buffer, currRenderState);
    });

    playBuffer(actx, buffer);
});

const noisey = createNoiseBuffer(actx, totalSeconds);
const A4 = createOscillatorBuffer(actx, 440, 0, .2, totalSeconds);
const A5 = createOscillatorBuffer(actx, 440*2, Math.PI/2 * .75, .2, totalSeconds);
const A4n5 = sum(actx, A4, A5);
const perlin = createPerlinBuffer(actx, 30, 40, .3, totalSeconds);
const decay = linearGain(actx, 0, .75, 0.006, totalSeconds);

const fused = product(actx, decay, perlin);
const summed = sum(actx, perlin, A5);
const inter = interpolate(actx, perlin, decay, .03, .1, 1);
const inter2 = interpolate(actx, perlin, A4n5, .03, 1, 1);
const instru = product(actx, inter, A4n5);
