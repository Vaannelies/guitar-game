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
class AudioPlayer extends HTMLElement {
    constructor() {
        super();
        this.audio = new Audio('./audio/perfect.mp3');
    }
    play() {
        const startPlayPromise = this.audio.play();
        if (startPlayPromise !== undefined) {
            startPlayPromise.then(() => {
            }).catch(error => {
                if (error.name === 'NotAllowedError') {
                    this.play();
                }
                else {
                    console.log("Error: ", error);
                }
            });
        }
    }
    pause() {
        this.audio.pause();
    }
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }
}
window.customElements.define("audioplayer-component", AudioPlayer);
class GameObject extends HTMLElement {
    constructor() {
        var _a, _b;
        super();
        this.rotation = 0;
        this.colors = ["Green", "Blue", "Orange", "White", "Black", "Red"];
        this._color = "";
        this._position = new Vector(Math.random() * window.innerWidth - this.clientWidth, (window.innerHeight - ((_a = document.getElementById('bar').getBoundingClientRect()) === null || _a === void 0 ? void 0 : _a.height) - 500));
        this.speed = 1.25;
        this.rotation = 90;
        console.log((window.innerHeight - ((_b = document.getElementById('bar').getBoundingClientRect()) === null || _b === void 0 ? void 0 : _b.height)));
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
        this.moveBullet();
    }
    moveBullet() {
        this._position.y += this.speed;
        this.draw();
        setTimeout(() => { this.moveBullet(); }, 10);
    }
    update() {
    }
    draw() {
        this.style.transform = `translate(${this._position.x}px, ${this._position.y}px) rotate(${this.rotation}deg)`;
    }
    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
    hasCollision(bar) {
        return (bar._position.y < this._position.y + this.clientHeight &&
            bar._position.y + bar.clientHeight > this._position.y);
    }
}
GameObject.numberOfShips = 0;
class Bar extends HTMLElement {
    constructor() {
        var _a;
        super();
        this.numberOfHits = 0;
        this._hit = false;
        this.previousHit = false;
        const bar = document.createElement('div');
        bar.setAttribute('id', 'bar');
        bar.setAttribute('style', 'position: absolute; bottom: 0; width: 100%; background: grey; height: 40px; z-index: -1;');
        (_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.appendChild(bar);
        this._position = new Vector(0, window.innerHeight);
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
        }
        this.previousHit = this._hit;
    }
}
window.customElements.define("bar-component", Bar);
class Bullet extends GameObject {
    constructor(note) {
        super();
        this.numberOfHits = 0;
        this._hit = false;
        this.previousHit = false;
        this.note = note;
        const banner = document.createElement('span');
        banner.innerHTML = this.note;
        this.appendChild(banner);
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
    hoi() {
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
        this.isPaused = false;
        this.timer = new Timer();
        const pitchdetect = new PitchDetect();
        console.log(pitchdetect);
        pitchdetect.updatePitch();
        this.bar = new Bar();
        console.log(this.bar);
        this.createMenu();
    }
    createMenu() {
        const body = document.querySelector('body');
        const menuContainer = document.createElement("div");
        menuContainer.setAttribute('style', 'height: 100vh; width: 100vw; z-index: 2; position: absolute; top: 0; left: 0; display: flex; justify-content: center; align-items: center');
        const menu = document.createElement("div");
        menu.setAttribute('style', 'display: flex; justify-content: center; padding: 10px; flex-direction: column; width: 40vw; height: 40vh; background: white; border-radius: 8px; align-items: center;');
        const title = document.createElement("h1");
        title.innerText = 'Are you ready?';
        title.setAttribute('style', 'font-size: 24px; text-align: center;');
        const button = document.createElement("button");
        button.setAttribute('style', 'font-size: 24px; padding: 20px; height: 2em; line-height: 0; background: black; border-radius: 8px; color: white;');
        button.innerText = "START";
        body === null || body === void 0 ? void 0 : body.appendChild(menuContainer);
        menuContainer.appendChild(menu);
        menu.appendChild(title);
        menu.appendChild(button);
        button.addEventListener('click', () => {
            menu.remove();
            this.start();
        });
        const pauseButton = document.createElement("button");
        pauseButton.innerText = "PAUSE";
        pauseButton.setAttribute('style', 'position: absolute; top: 10px; font-size: 14px; padding: 8px; background: black; border-radius: 8px; color: white;');
        menuContainer.appendChild(pauseButton);
        pauseButton.addEventListener('click', () => {
            this.isPaused = !this.isPaused;
            if (this.isPaused) {
                this.audioPlayer.pause();
                this.timer.stopTimer();
            }
            else {
                this.audioPlayer.play();
                this.gameLoop();
                this.timer.startTimer();
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fetchNotesForSong();
            console.log("notes", this.notes);
            this.timer.startTimer();
            this.audioPlayer = new AudioPlayer();
            this.audioPlayer.play();
            this.messageboard = Messageboard.getInstance();
            console.log(this.messageboard);
            this.gameLoop();
        });
    }
    fetchNotesForSong() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch("notes/perfect.json")
                .then(response => response.json())
                .then(json => { this.notes = json.notes; });
        });
    }
    gameLoop() {
        if (this.timer.sec == 5) {
            console.log("het is 5 lol");
        }
        this.notes.forEach(note => {
            if (note.time.toString() == (this.timer.sec + "." + this.timer.ms).toString()) {
                console.log(note.title);
                this.bullets.push(new Bullet(note.title));
            }
        });
        for (const ship of this.bullets) {
            ship.update();
            for (const otherShip of this.bullets) {
                if (ship !== otherShip) {
                    if (ship.hasCollision(this.bar)) {
                        ship.hit = true;
                        break;
                    }
                    else {
                        ship.hit = false;
                    }
                }
            }
        }
        if (!this.isPaused) {
            requestAnimationFrame(() => this.gameLoop());
        }
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
class Timer extends HTMLElement {
    constructor() {
        var _a;
        super();
        this.min = 0;
        this.sec = 0;
        this.ms = 0;
        this.stoptime = true;
        this.timer = document.createElement('div');
        (_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.appendChild(this.timer);
    }
    startTimer() {
        if (this.stoptime == true) {
            this.stoptime = false;
            this.timerCycle();
        }
    }
    stopTimer() {
        if (this.stoptime == false) {
            this.stoptime = true;
        }
    }
    timerCycle() {
        if (this.stoptime == false) {
            this.ms = parseInt(this.ms);
            this.sec = parseInt(this.sec);
            this.min = parseInt(this.min);
            this.ms = this.ms + 1;
            if (this.ms == 60) {
                this.sec = this.sec + 1;
                this.ms = 0;
            }
            if (this.sec == 60) {
                this.min = this.min + 1;
                this.sec = 0;
                this.ms = 0;
            }
            if (this.ms < 10 || this.ms == 0) {
                this.ms = '0' + this.ms;
            }
            if (this.sec < 10 || this.sec == 0) {
                this.sec = '0' + this.sec;
            }
            if (this.min < 10 || this.min == 0) {
                this.min = '0' + this.min;
            }
            this.timer.innerHTML = this.min + ':' + this.sec + ':' + this.ms;
            setTimeout(() => { this.timerCycle(); }, 10);
        }
    }
    resetTimer() {
        this.stoptime = true;
        this.min = 0;
        this.ms = 0;
        this.sec = 0;
    }
}
window.customElements.define("timer-component", Timer);
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