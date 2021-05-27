"use strict";
class Main {
    constructor() {
        this.bullets = [];
        this.audioContext = null;
        this.isPlaying = false;
        this.sourceNode = null;
        this.analyser = null;
        this.theBuffer = null;
        this.DEBUGCANVAS = null;
        this.mediaStreamSource = null;
        this.rafID = null;
        this.tracks = null;
        this.buflen = 2048;
        this.buf = new Float32Array(this.buflen);
        this.noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        window.AudioContext = window.AudioContext;
        this.audioContext = new AudioContext();
        var request = new XMLHttpRequest();
        request.open("GET", "./audio/vocal1.ogg", true);
        request.responseType = "arraybuffer";
        request.onload = () => {
            var _a;
            (_a = this.audioContext) === null || _a === void 0 ? void 0 : _a.decodeAudioData(request.response, (buffer) => {
                this.theBuffer = buffer;
            });
        };
        request.send();
        this.detectorElem = document.getElementById("detector");
        this.canvasElem = document.getElementById("output");
        this.DEBUGCANVAS = document.getElementById("waveform");
        if (this.DEBUGCANVAS) {
            this.waveCanvas = this.DEBUGCANVAS.getContext("2d");
            this.waveCanvas.strokeStyle = "black";
            this.waveCanvas.lineWidth = 1;
        }
        this.pitchElem = document.getElementById("pitch");
        this.noteElem = document.getElementById("note");
        this.detuneElem = document.getElementById("detune");
        this.detuneAmount = document.getElementById("detune_amt");
        this.detectorElem.ondragenter = function () {
            this.classList.add("droptarget");
            return false;
        };
        this.detectorElem.ondragleave = function () { this.classList.remove("droptarget"); return false; };
        this.detectorElem.ondrop = function (e) {
            this.classList.remove("droptarget");
            e.preventDefault();
            this.theBuffer = null;
            var reader = new FileReader();
            reader.onload = (event) => {
                var _a;
                (_a = this.audioContext) === null || _a === void 0 ? void 0 : _a.decodeAudioData(event.target.result, (buffer) => {
                    this.theBuffer = buffer;
                }, function () { alert("error loading!"); });
            };
            reader.onerror = function () {
                alert("Error: " + reader.error);
            };
            reader.readAsArrayBuffer(e.dataTransfer.files[0]);
            return false;
        };
        for (let i = 0; i < 10; i++) {
            this.bullets.push(new Bullet());
        }
        this.messageboard = Messageboard.getInstance();
        console.log(this.messageboard);
        this.gameLoop();
    }
    gameLoop() {
        console.log("yo");
        for (const ship of this.bullets) {
            ship.update();
            for (const otherShip of this.bullets) {
                if (ship !== otherShip) {
                    if (ship.hasCollision(otherShip)) {
                        ship.hit = true;
                        break;
                    }
                    else {
                        ship.hit = false;
                    }
                }
            }
        }
        requestAnimationFrame(() => this.gameLoop());
    }
    error() {
        alert('Stream generation failed.');
    }
    getUserMedia(dictionary, callback) {
        try {
            navigator.getUserMedia =
                navigator.getUserMedia ||
                    navigator.getUserMedia(dictionary, callback, this.error);
        }
        catch (e) {
            alert('getUserMedia threw exception :' + e);
        }
    }
    gotStream(stream) {
        var _a, _b;
        this.mediaStreamSource = (_a = this.audioContext) === null || _a === void 0 ? void 0 : _a.createMediaStreamSource(stream);
        this.analyser = (_b = this.audioContext) === null || _b === void 0 ? void 0 : _b.createAnalyser();
        this.analyser.fftSize = 2048;
        this.mediaStreamSource.connect(this.analyser);
        this.updatePitch();
    }
    toggleOscillator() {
        var _a, _b, _c;
        if (this.isPlaying) {
            this.sourceNode.stop(0);
            this.sourceNode = null;
            this.analyser = null;
            this.isPlaying = false;
            if (!window.cancelAnimationFrame)
                window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
            window.cancelAnimationFrame(this.rafID);
            return "play oscillator";
        }
        this.sourceNode = (_a = this.audioContext) === null || _a === void 0 ? void 0 : _a.createOscillator();
        this.analyser = (_b = this.audioContext) === null || _b === void 0 ? void 0 : _b.createAnalyser();
        this.analyser.fftSize = 2048;
        this.sourceNode.connect(this.analyser);
        this.analyser.connect((_c = this.audioContext) === null || _c === void 0 ? void 0 : _c.destination);
        this.sourceNode.start(0);
        this.isPlaying = true;
        this.updatePitch();
        return "stop";
    }
    toggleLiveInput() {
        if (this.isPlaying) {
            this.sourceNode.stop(0);
            this.sourceNode = null;
            this.analyser = null;
            this.isPlaying = false;
            if (!window.cancelAnimationFrame)
                window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
            window.cancelAnimationFrame(this.rafID);
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
        }, this.gotStream);
    }
    togglePlayback() {
        var _a, _b, _c;
        if (this.isPlaying) {
            this.sourceNode.stop(0);
            this.sourceNode = null;
            this.analyser = null;
            this.isPlaying = false;
            if (!window.cancelAnimationFrame)
                window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
            window.cancelAnimationFrame(this.rafID);
            return "start";
        }
        this.sourceNode = (_a = this.audioContext) === null || _a === void 0 ? void 0 : _a.createBufferSource();
        this.sourceNode.buffer = this.theBuffer;
        this.sourceNode.loop = true;
        this.analyser = (_b = this.audioContext) === null || _b === void 0 ? void 0 : _b.createAnalyser();
        this.analyser.fftSize = 2048;
        this.sourceNode.connect(this.analyser);
        this.analyser.connect((_c = this.audioContext) === null || _c === void 0 ? void 0 : _c.destination);
        this.sourceNode.start(0);
        this.isPlaying = true;
        this.updatePitch();
        return "stop";
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
        this.analyser.getFloatTimeDomainData(this.buf);
        let ac = this.autoCorrelate(this.buf, (_a = this.audioContext) === null || _a === void 0 ? void 0 : _a.sampleRate);
        if (this.DEBUGCANVAS) {
            this.waveCanvas.clearRect(0, 0, 512, 256);
            this.waveCanvas.strokeStyle = "red";
            this.waveCanvas.beginPath();
            this.waveCanvas.moveTo(0, 0);
            this.waveCanvas.lineTo(0, 256);
            this.waveCanvas.moveTo(128, 0);
            this.waveCanvas.lineTo(128, 256);
            this.waveCanvas.moveTo(256, 0);
            this.waveCanvas.lineTo(256, 256);
            this.waveCanvas.moveTo(384, 0);
            this.waveCanvas.lineTo(384, 256);
            this.waveCanvas.moveTo(512, 0);
            this.waveCanvas.lineTo(512, 256);
            this.waveCanvas.stroke();
            this.waveCanvas.strokeStyle = "black";
            this.waveCanvas.beginPath();
            this.waveCanvas.moveTo(0, this.buf[0]);
            for (var i = 1; i < 512; i++) {
                this.waveCanvas.lineTo(i, 128 + (this.buf[i] * 128));
            }
            this.waveCanvas.stroke();
        }
        if (ac == -1) {
            this.detectorElem.className = "vague";
            this.pitchElem.innerText = "--";
            this.noteElem.innerText = "-";
            this.detuneElem.className = "";
            this.detuneAmount.innerText = "--";
        }
        else {
            this.detectorElem.className = "confident";
            let pitch = ac;
            this.pitchElem.innerText = Math.round(pitch);
            let note = this.noteFromPitch(pitch);
            this.noteElem.innerHTML = this.noteStrings[note % 12];
            let detune = this.centsOffFromPitch(pitch, note);
            if (detune == 0) {
                this.detuneElem.className = "";
                this.detuneAmount.innerHTML = "--";
            }
            else {
                if (detune < 0)
                    this.detuneElem.className = "flat";
                else
                    this.detuneElem.className = "sharp";
                this.detuneAmount.innerHTML = Math.abs(detune);
            }
        }
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        this.rafID = window.requestAnimationFrame(this.updatePitch);
    }
}
window.addEventListener("load", () => new Main());
//# sourceMappingURL=main.js.map