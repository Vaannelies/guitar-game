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
class GameObject extends HTMLElement {
    constructor() {
        super();
        this.rotation = 0;
        this.colors = ["Green", "Blue", "Orange", "White", "Black", "Red"];
        this._color = "";
        this._position = new Vector(Math.random() * window.innerWidth - this.clientWidth, Math.random() * window.innerHeight - this.clientHeight);
        this.speed = new Vector(2, 4);
        this.rotation = 90;
        this.createShip();
    }
    get position() { return this._position; }
    get color() { return this._color; }
    createShip() {
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
        GameObject.numberOfShips++;
        if (GameObject.numberOfShips > 6)
            GameObject.numberOfShips = 1;
        this.style.backgroundImage = `url(images/ship${GameObject.numberOfShips + 3}.png)`;
        this._color = this.colors[GameObject.numberOfShips - 1];
    }
    update() {
        this._position.x += Math.cos(this.degToRad(this.rotation)) * this.speed.x;
        this._position.y += Math.sin(this.degToRad(this.rotation)) * this.speed.y;
        this.draw();
    }
    draw() {
        this.style.transform = `translate(${this._position.x}px, ${this._position.y}px) rotate(${this.rotation}deg)`;
    }
    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
    hasCollision(ship) {
        return (ship._position.x < this._position.x + this.clientWidth &&
            ship._position.x + ship.clientWidth > this._position.x &&
            ship._position.y < this._position.y + this.clientHeight &&
            ship._position.y + ship.clientHeight > this._position.y);
    }
}
GameObject.numberOfShips = 0;
class Bullet extends GameObject {
    constructor() {
        super();
        this.numberOfHits = 0;
        this._hit = false;
        this.previousHit = false;
        this.captain = new Captain(this);
    }
    set hit(value) { this._hit = value; }
    update() {
        this.checkCollision();
        this.captain.update();
        super.update();
    }
    checkCollision() {
        if (this._hit && !this.previousHit) {
            this.captain.onCollision(++this.numberOfHits);
            let times = this.numberOfHits == 1 ? "time" : "times";
            console.log(`${this.color} pirateship got hit ${this.numberOfHits} ${times}!`);
            Messageboard.getInstance().addMessage(`${this.color} pirateship got hit ${this.numberOfHits} ${times}!`);
        }
        this.previousHit = this._hit;
    }
}
window.customElements.define("ship-component", Bullet);
class Messageboard extends HTMLElement {
    constructor() {
        super();
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
        console.log("Hoii");
    }
    static getInstance() {
        if (!Messageboard.instance)
            Messageboard.instance = new Messageboard();
        return Messageboard.instance;
    }
    addMessage(m) {
        console.log("Hoi2");
        let item = document.createElement("LI");
        item.innerHTML = m;
        this.appendChild(item);
    }
}
window.addEventListener("load", () => Messageboard.getInstance());
window.customElements.define("messageboard-component", Messageboard);
class Captain extends HTMLElement {
    constructor(ship) {
        super();
        this.ship = ship;
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
    }
    update() {
        let x = this.ship.position.x + this.ship.clientWidth / 2;
        let y = this.ship.position.y;
        this.style.transform = `translate(${x}px, ${y}px) rotate(${0}deg)`;
    }
    onCollision(numberOfHits) {
        if (numberOfHits == 1) {
            this.style.backgroundImage = `url(images/emote_alert.png)`;
            console.log(`Captain of ${this.ship.color} pirateship WOKE UP!`);
            Messageboard.getInstance().addMessage(`Captain of ${this.ship.color} pirateship WOKE UP!`);
        }
        else if (numberOfHits == 7) {
            this.style.backgroundImage = `url(images/emote_faceAngry.png)`;
            console.log(`Captain of ${this.ship.color} pirateship got ANGRY!`);
            Messageboard.getInstance().addMessage(`Captain of ${this.ship.color} pirateship got ANGRY!`);
        }
    }
}
window.customElements.define("captain-component", Captain);
class Main {
    constructor() {
        this.bullets = [];
        for (let i = 0; i < 10; i++) {
            this.bullets.push(new Bullet());
        }
        this.messageboard = Messageboard.getInstance();
        console.log(this.messageboard);
        const pitchdetect = new PitchDetect();
        console.log(pitchdetect);
        pitchdetect.updatePitch();
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
}
window.addEventListener("load", () => new Main());
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
        this.detectorElem.ondragenter = () => {
            this.classList.add("droptarget");
            return false;
        };
        this.detectorElem.ondragleave = () => { this.classList.remove("droptarget"); return false; };
        this.detectorElem.ondrop = (e) => {
            this.classList.remove("droptarget");
            e.preventDefault();
            this.theBuffer = null;
            var reader = new FileReader();
            reader.onload = (event) => {
                var _a;
                (_a = this.audioContext) === null || _a === void 0 ? void 0 : _a.decodeAudioData(event.target.result, (buffer) => {
                    this.theBuffer = buffer;
                }, () => { alert("error loading!"); });
            };
            reader.onerror = () => {
                alert("Error: " + reader.error);
            };
            reader.readAsArrayBuffer(e.dataTransfer.files[0]);
            return false;
        };
        this.toggleLiveInput();
        console.log("liveinput)");
    }
    error() {
        alert('Stream generation failed.');
    }
    getUserMedia(dictionary) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                navigator.getUserMedia =
                    navigator.getUserMedia;
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
        return __awaiter(this, void 0, void 0, function* () {
            console.log("toggle");
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
            });
        });
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
        if (this.analyser) {
            this.analyser.getFloatTimeDomainData(this.buf);
        }
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
        this.rafID = window.requestAnimationFrame(this.updatePitch.bind(this));
    }
}
window.customElements.define("pitchdetect-component", PitchDetect);
class Vector {
    constructor(x, y) {
        this._x = 0;
        this._y = 0;
        this._x = x;
        this._y = y;
    }
    get x() { return this._x; }
    set x(value) { this._x = value; }
    get y() { return this._y; }
    set y(value) { this._y = value; }
}
//# sourceMappingURL=main.js.map