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
        var _a;
        super();
        this.rotation = 0;
        this.colors = ["Green", "Blue", "Orange", "White", "Black", "Red"];
        this._color = "";
        this.speed = (((_a = document.getElementById('bar').getBoundingClientRect()) === null || _a === void 0 ? void 0 : _a.top) / 4);
        this._position = new Vector(Math.random() * window.innerWidth - this.clientWidth, 0);
        this.rotation = 0;
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
        this.style.backgroundColor = "white";
        this.style.height = "10vh";
        this.style.minHeight = "40px";
        this.style.width = "10vh";
        this.style.minWidth = "40px";
        this.style.borderRadius = "100px";
        this.style.boxShadow = "0 0 30px 1px #3c00ff";
        this._color = this.colors[GameObject.numberOfShips - 1];
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
        var _a, _b;
        return (((_a = document.getElementById('bar').getBoundingClientRect()) === null || _a === void 0 ? void 0 : _a.top) < (this._position.y + this.clientHeight) &&
            ((_b = document.getElementById('bar').getBoundingClientRect()) === null || _b === void 0 ? void 0 : _b.bottom) > (this._position.y - this.clientHeight));
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
        bar.setAttribute('style', 'position: absolute; bottom: 0; width: 100%; background: white; height: 10vh; min-height: 40px; z-index: -1; border-top: 2px solid  #ccddFF; box-shadow: 0 0 10px 1px  #ccddFF;');
        (_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.appendChild(bar);
        this._position = new Vector(0, window.innerHeight);
    }
    set hit(value) { this._hit = value; }
    update() {
        this.checkCollision();
        super.update();
    }
    checkCollision() {
        if (this._hit && !this.previousHit) {
            let times = this.numberOfHits == 1 ? "time" : "times";
        }
        this.previousHit = this._hit;
    }
}
window.customElements.define("bar-component", Bar);
class Bullet extends GameObject {
    constructor(note, time) {
        super();
        this.numberOfHits = 0;
        this._hit = false;
        this.previousHit = false;
        this.time = time;
        this.note = note;
        this.main = Main.getInstance();
        this._position = new Vector(Math.random() * window.innerWidth - this.clientWidth, this.clientHeight - ((this.main.audioPlayer.audio.duration - parseInt(this.time.sec)) * this.speed));
        this.style.display = "flex";
        this.style.justifyContent = "center";
        this.style.alignItems = "center";
        const banner = document.createElement('span');
        banner.innerHTML = this.note;
        this.appendChild(banner);
        this.moveBullet();
    }
    set hit(value) { this._hit = value; }
    update() {
        this.checkCollision();
    }
    moveBullet() {
        console.log(this.main.audioPlayer.audio.currentTime % 60);
        this._position.y =
            (((this.main.audioPlayer.audio.currentTime % 60) - (parseInt(this.time.sec) - 4)) * this.speed);
        this.draw();
        setTimeout(() => { this.moveBullet(); }, 100);
    }
    draw() {
        this.style.transform = `translate(${this._position.x}px, ${this._position.y}px) rotate(${this.rotation}deg)`;
    }
    checkCollision() {
        if (this._hit && !this.previousHit) {
            let times = this.numberOfHits == 1 ? "time" : "times";
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
    }
    static getInstance() {
        if (!Messageboard.instance)
            Messageboard.instance = new Messageboard();
        return Messageboard.instance;
    }
    addMessage(m) {
        let item = document.createElement("LI");
        item.innerHTML = m;
        this.appendChild(item);
    }
}
window.addEventListener("load", () => Messageboard.getInstance());
window.customElements.define("messageboard-component", Messageboard);
class Main {
    constructor() {
        this.bullets = [];
        this.isPaused = false;
        Main.instance = this;
        this.createMenu();
        this.timer = new Timer();
        this.pitchdetect = new PitchDetect();
        this.audioPlayer = new AudioPlayer();
        this.bar = new Bar();
    }
    static getInstance() {
        if (!Main.instance) {
            console.log('new main');
            Main.instance = new Main();
        }
        return this.instance;
    }
    createMenu() {
        const body = document.querySelector('body');
        const menuContainer = document.createElement("div");
        menuContainer.setAttribute('id', 'menu-container');
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
        this.delayMonitor = document.createElement("h1");
        this.delayMonitor.setAttribute('style', 'z-index: 1; color: white; position: absolute; top: 0;');
        menuContainer.appendChild(this.delayMonitor);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fetchNotesForSong();
            this.timer.startTimer();
            this.audioPlayer.play();
            this.messageboard = Messageboard.getInstance();
            this.notes.forEach(note => {
                this.bullets.push(new Bullet(note.title, note.time));
            });
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
    checkDelay() {
        this.delay = (this.timer.sec + this.timer.ms / 100) - (this.audioPlayer.audio.currentTime % 60);
        console.log("timer sec", this.timer.sec, "currentimesec", this.audioPlayer.audio.currentTime % 60);
        this.delayMonitor.innerHTML = this.audioPlayer.audio.currentTime.toString();
        if (this.delay <= -0.4 || this.delay >= 0.4) {
            this.timer.sec = Math.round(this.audioPlayer.audio.currentTime % 60);
            this.timer.ms = this.audioPlayer.audio.currentTime.toString().split(".")[1].substring(0, 2);
            console.log("fixed delay");
        }
    }
    fixCurrentPositions() {
        for (const ship of this.bullets) {
            ship._position.y = ship.clientHeight + ship.speed * (this.timer.sec - parseInt(ship.time.sec));
        }
    }
    spawnLateBullets() {
        for (const note of this.notes) {
            if ((this.timer.sec - this.delay) > (parseInt(note.time.sec) - 4) && (this.timer.sec - this.delay) < (parseInt(note.time.sec))) {
                if ((this.bullets.filter(bullet => bullet.time === note.time)).length < 1) {
                    const newBullet = new Bullet(note.title, note.time);
                    this.bullets.push(newBullet);
                    newBullet._position.y = newBullet.speed * this.delay * 100;
                }
            }
        }
    }
    gameLoop() {
        this.checkDelay();
        if (this.timer.sec == 5) {
        }
        for (const ship of this.bullets) {
            for (const otherShip of this.bullets) {
                if (ship !== otherShip) {
                    if (ship.hasCollision(this.bar)) {
                        if (!this.pitchdetect.active) {
                            this.pitchdetect.activate();
                        }
                        else {
                            ship.hit = true;
                            ship.style.backgroundColor = "#e2eaff";
                            if (this.pitchdetect.noteStrings[this.pitchdetect.note % 12] === ship.note) {
                                ship.style.backgroundColor = "#00ee00";
                                ship.style.boxShadow = "0 0 30px 1px #00ee00";
                            }
                            break;
                        }
                    }
                    else {
                        ship.style.boxShadow = "0 0 30px 1px #3c00ff";
                        ship.style.backgroundColor = "white";
                        ship.hit = false;
                        this.pitchdetect.active = false;
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
            }
            else {
                this.pitch = ac;
                this.note = this.noteFromPitch(this.pitch);
                this.detune = this.centsOffFromPitch(this.pitch, this.note);
                if (this.detune == 0) {
                    console.log('perfect!');
                }
                else {
                }
            }
            this.activeTime++;
            console.log(this.activeTime);
            setTimeout(() => { this.updatePitch(); }, 19);
        }
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
        (_a = document.getElementById('menu-container')) === null || _a === void 0 ? void 0 : _a.appendChild(this.timer);
        this.timer.setAttribute('style', 'z-index: 1; color: white; position: absolute; top: 0;');
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
            if (this.sec == 60 && this.ms == 0) {
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