"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class PitchDetect extends HTMLElement {
    constructor() {
        super();
        this.audioContext = null;
        this.isPlaying = false;
        this.sourceNode = null;
        this.analyser = null;
        this.theBuffer = null;
        this.DEBUGCANVAS = null;
        this.mediaStreamSource = null;
        this.activeTime = 0;
        this.rafID = null;
        this.tracks = null;
        this.buflen = 2048;
        this.buf = new Float32Array(this.buflen);
        this.noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        window.AudioContext = window.AudioContext;
        this.audioContext = new AudioContext();
        this.active = false;
        this.updatePitch();
        this.toggleLiveInput();
        console.log("liveinput)");
    }
    activate() {
        this.activeTime = 0;
        this.active = true;
        this.updatePitch();
    }
    error() {
        alert('Stream generation failed.');
    }
    getUserMedia(dictionary) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                navigator.getUserMedia =
                    navigator.getUserMedia;
                (navigator === null || navigator === void 0 ? void 0 : navigator.webkitGetUserMedia) ||
                    (navigator === null || navigator === void 0 ? void 0 : navigator.mozGetUserMedia);
                yield navigator.mediaDevices.getUserMedia(dictionary)
                    .then((res) => {
                    console.log(res);
                    this.gotStream(res);
                });
            }
            catch (e) {
                alert('getUserMedia threw exception :' + e);
            }
        });
    }
    gotStream(stream) {
        var _a, _b;
        this.mediaStreamSource = (_a = this.audioContext) === null || _a === void 0 ? void 0 : _a.createMediaStreamSource(stream);
        this.analyser = (_b = this.audioContext) === null || _b === void 0 ? void 0 : _b.createAnalyser();
        this.analyser.fftSize = 2048;
        this.mediaStreamSource.connect(this.analyser);
        this.updatePitch();
    }
    toggleLiveInput() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("toggle");
            if (this.isPlaying) {
                this.sourceNode.stop(0);
                this.sourceNode = null;
                this.analyser = null;
                this.isPlaying = false;
            }
            this.getUserMedia({
                "audio": {
                    "mandatory": {
                        "googEchoCancellation": "false",
                        "googAutoGainControl": "false",
                        "googNoiseSuppression": "false",
                        "googHighpassFilter": "false"
                    },
                    "optional": []
                },
            });
        });
    }
    noteToOutputNote(note, octave) {
        const noteString = this.noteStrings[note % 12];
        if (this.noteStrings[note % 12].indexOf("#") !== -1) {
            return noteString + this.octave;
        }
        else {
            return noteString.substring(0, 1) + this.octave + noteString.substring(1, 2);
        }
    }
    octaveFromNote(note) {
        return (note - note % 12) / 12 - 1;
    }
    noteFromPitch(frequency) {
        var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
        return Math.round(noteNum) + 69;
    }
    frequencyFromNoteNumber(note) {
        return 440 * Math.pow(2, (note - 69) / 12);
    }
    centsOffFromPitch(frequency, note) {
        return Math.floor(1200 * Math.log(frequency / this.frequencyFromNoteNumber(note)) / Math.log(2));
    }
    autoCorrelate(buf, sampleRate) {
        var SIZE = buf.length;
        var rms = 0;
        for (var i = 0; i < SIZE; i++) {
            var val = buf[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / SIZE);
        if (rms < 0.01)
            return -1;
        var r1 = 0, r2 = SIZE - 1, thres = 0.2;
        for (var i = 0; i < SIZE / 2; i++)
            if (Math.abs(buf[i]) < thres) {
                r1 = i;
                break;
            }
        for (var i = 1; i < SIZE / 2; i++)
            if (Math.abs(buf[SIZE - i]) < thres) {
                r2 = SIZE - i;
                break;
            }
        buf = buf.slice(r1, r2);
        SIZE = buf.length;
        var c = new Array(SIZE).fill(0);
        for (var i = 0; i < SIZE; i++)
            for (var j = 0; j < SIZE - i; j++)
                c[i] = c[i] + buf[j] * buf[j + i];
        var d = 0;
        while (c[d] > c[d + 1])
            d++;
        var maxval = -1, maxpos = -1;
        for (var i = d; i < SIZE; i++) {
            if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
            }
        }
        var T0 = maxpos;
        var x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
        let a = (x1 + x3 - 2 * x2) / 2;
        let b = (x3 - x1) / 2;
        if (a)
            T0 = T0 - b / (2 * a);
        return sampleRate / T0;
    }
    updatePitch() {
        var _a;
        if (this.active && this.activeTime < 10) {
            if (this.analyser) {
                this.analyser.getFloatTimeDomainData(this.buf);
            }
            let ac = this.autoCorrelate(this.buf, (_a = this.audioContext) === null || _a === void 0 ? void 0 : _a.sampleRate);
            if (ac == -1) {
                this.note = null;
            }
            else {
                this.pitch = ac;
                this.note = this.noteFromPitch(this.pitch);
                this.octave = this.octaveFromNote(this.note);
                this.outputNote = this.noteToOutputNote(this.note, this.octave);
                this.detune = this.centsOffFromPitch(this.pitch, this.note);
                if (this.detune == 0) {
                    console.log('perfect!');
                }
            }
            this.activeTime++;
            setTimeout(() => { this.updatePitch(); }, 19);
        }
    }
}
window.customElements.define("pitchdetect-component", PitchDetect);
//# sourceMappingURL=pitchdetect.js.map