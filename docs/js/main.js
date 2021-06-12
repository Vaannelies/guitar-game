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
        this.audio.setAttribute('id', 'audio');
        console.log(this.audio);
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
    fadeOut() {
        setTimeout(() => {
            this.audio.volume = 0.8;
            setTimeout(() => {
                this.audio.volume = 0.6;
                setTimeout(() => {
                    this.audio.volume = 0.4;
                    setTimeout(() => {
                        this.audio.volume = 0.2;
                        setTimeout(() => {
                            this.audio.volume = 0.0;
                        }, 300);
                    }, 300);
                }, 300);
            }, 300);
        }, 300);
    }
}
window.customElements.define("audioplayer-component", AudioPlayer);
class GameObject extends HTMLElement {
    constructor() {
        var _a;
        super();
        this.rotation = 0;
        this.speed = (((_a = document.getElementById('bar').getBoundingClientRect()) === null || _a === void 0 ? void 0 : _a.top) / 4);
        this._position = new Vector(0, 0);
        this.rotation = 0;
        this.createBullet();
    }
    get position() { return this._position; }
    createBullet() {
        let game = document.getElementsByTagName("game")[0];
        this.setAttribute('class', 'bullet');
        game.appendChild(this);
        this._position = new Vector(Math.random() * window.innerWidth - this.clientWidth, 0);
        GameObject.numberOfBullets++;
        if (GameObject.numberOfBullets > 6)
            GameObject.numberOfBullets = 1;
    }
    draw() {
        this.style.transform = `translate(${this._position.x}px, ${this._position.y}px) rotate(${this.rotation}deg)`;
    }
    hasCollision(bar) {
        var _a, _b;
        return (((_a = document.getElementById('bar').getBoundingClientRect()) === null || _a === void 0 ? void 0 : _a.top) < (this._position.y + this.clientHeight) &&
            ((_b = document.getElementById('bar').getBoundingClientRect()) === null || _b === void 0 ? void 0 : _b.bottom) > (this._position.y - this.clientHeight));
    }
}
GameObject.numberOfBullets = 0;
class Bar extends HTMLElement {
    constructor() {
        var _a;
        super();
        const bar = document.createElement('div');
        bar.setAttribute('id', 'bar');
        bar.setAttribute('style', 'position: absolute; bottom: 0; width: 100%; background: white; height: 10vh; min-height: 40px; z-index: -1; border-top: 2px solid  #ccddFF; box-shadow: 0 0 10px 1px  #ccddFF;');
        (_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.appendChild(bar);
    }
}
window.customElements.define("bar-component", Bar);
class Bullet extends GameObject {
    constructor(note, time) {
        super();
        this.time = time;
        this.note = note;
        this.pointWasGiven = false;
        this.main = Main.getInstance();
        this._position = new Vector((Math.random() * window.innerWidth - this.clientWidth) + (this.clientWidth / 2), this.clientHeight - ((this.main.audioPlayer.audio.duration - (parseInt(this.time.sec) + (parseInt(this.time.min) * 60))) * this.speed));
        this.style.display = "flex";
        this.style.justifyContent = "center";
        this.style.alignItems = "center";
        const banner = document.createElement('span');
        banner.innerHTML = this.note;
        this.appendChild(banner);
        this.moveBullet();
    }
    moveBullet() {
        this._position.y =
            (((this.main.audioPlayer.audio.currentTime) - ((parseInt(this.time.sec) + (parseInt(this.time.min) * 60) + (parseInt(this.time.ms) / 100)) - 4)) * this.speed);
        this.draw();
        setTimeout(() => { this.moveBullet(); }, 100);
    }
    draw() {
        this.style.transform = `translate(${this._position.x}px, ${this._position.y}px) rotate(${this.rotation}deg)`;
    }
}
window.customElements.define("bullet-component", Bullet);
class Credits extends HTMLElement {
    constructor() {
        var _a;
        super();
        this.setAttribute('class', 'pause-menu');
        this.main = Main.getInstance();
        const text = document.createElement('div');
        text.innerHTML = "<h2>CREDITS</h2><p>Song: <a href='https://www.youtube.com/watch?v=2Vv-BfVoq4g' target='_blank'>Perfect by Ed Sheeran</a><br><br>This game was created by Annelies Vaandrager</p>";
        this.appendChild(text);
        const button = document.createElement('button');
        button.setAttribute('class', 'back');
        button.innerText = "BACK";
        button.addEventListener('click', () => { this.main.createMenu(); this.remove(); });
        this.appendChild(button);
        (_a = document.getElementById('menu-container')) === null || _a === void 0 ? void 0 : _a.appendChild(this);
    }
}
window.customElements.define("credits-component", Credits);
class Finish extends HTMLElement {
    constructor() {
        var _a;
        super();
        this.setAttribute('class', 'pause-menu');
        this.main = Main.getInstance();
        const text = document.createElement('div');
        text.innerHTML = `<h2>Well done!</h2><p>Score: ${this.main.points}</p>`;
        this.appendChild(text);
        const stopButton = document.createElement('button');
        stopButton.innerText = "OK";
        stopButton.addEventListener('click', () => { this.main.stopGame(); this.remove(); });
        this.appendChild(stopButton);
        (_a = document.getElementById('menu-container')) === null || _a === void 0 ? void 0 : _a.appendChild(this);
    }
}
window.customElements.define("finish-component", Finish);
class Instructions extends HTMLElement {
    constructor() {
        var _a;
        super();
        this.setAttribute('class', 'pause-menu');
        this.main = Main.getInstance();
        const text = document.createElement('div');
        text.innerHTML = "<h2>HOW TO PLAY?</h2><p>Listen to the song and hit the right notes as they reach the bottom of the screen.<br><br>Grab your guitar and play along!</p>";
        this.appendChild(text);
        const button = document.createElement('button');
        button.setAttribute('class', 'back');
        button.innerText = "BACK";
        button.addEventListener('click', () => { this.main.createMenu(); this.remove(); });
        this.appendChild(button);
        (_a = document.getElementById('menu-container')) === null || _a === void 0 ? void 0 : _a.appendChild(this);
    }
}
window.customElements.define("instructions-component", Instructions);
class Timer extends HTMLElement {
    constructor() {
        var _a;
        super();
        this.min = 0;
        this.sec = 0;
        this.ms = 0;
        this.stoptime = true;
        this.innerHTML = '<h2></h2>';
        (_a = document.getElementById('menu-container')) === null || _a === void 0 ? void 0 : _a.appendChild(this);
        this.setAttribute('style', 'z-index: 1; color: white; position: absolute; top: 0; left: 25px;');
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
            this.innerHTML = '<h2>' + this.min + ':' + this.sec + ':' + this.ms + '</h2>';
            setTimeout(() => { this.timerCycle(); }, 10);
        }
    }
    resetTimer() {
        this.innerHTML = '<h2>00:00:00</h2>';
        this.stoptime = true;
        this.min = 0;
        this.ms = 0;
        this.sec = 0;
    }
}
window.customElements.define("timer-component", Timer);
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
                navigator.mediaDevices.getUserMedia =
                    (navigator === null || navigator === void 0 ? void 0 : navigator.mediaDevices.getUserMedia) ||
                        (navigator === null || navigator === void 0 ? void 0 : navigator.mediaDevices.webkitGetUserMedia) ||
                        (navigator === null || navigator === void 0 ? void 0 : navigator.mediaDevices.mozGetUserMedia);
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
class Main {
    constructor() {
        var _a;
        this.bullets = [];
        this.isPaused = false;
        this.menuContainer = document.createElement("div");
        this.menuContainer.setAttribute('id', 'menu-container');
        (_a = document.body) === null || _a === void 0 ? void 0 : _a.appendChild(this.menuContainer);
        this.createMenu();
        this.pitchdetect = new PitchDetect();
        this.audioPlayer = new AudioPlayer();
        this.points = 0;
        this.songTitle = document.createElement('div');
        this.songTitle.setAttribute('class', 'song-title');
        this.songTitle.innerHTML = "<h1 class='song-title --title'>Perfect</h1><p class='song-title --artist'>Ed Sheeran</p>";
        document.body.appendChild(this.songTitle);
        this.bar = new Bar();
    }
    static getInstance() {
        if (!Main.instance) {
            Main.instance = new Main();
        }
        return this.instance;
    }
    createMenu() {
        const menu = document.createElement("div");
        menu.setAttribute('id', 'menu');
        const title = document.createElement("h1");
        title.setAttribute('class', 'title');
        title.innerText = 'Are you ready?';
        const button = document.createElement("button");
        button.setAttribute('class', 'button --start');
        button.innerText = "START";
        const instructionsButton = document.createElement("button");
        instructionsButton.setAttribute('class', 'button --instructions');
        instructionsButton.innerText = "HOW TO PLAY?";
        const creditsButton = document.createElement("button");
        creditsButton.setAttribute('class', 'button --credits');
        creditsButton.innerText = "CREDITS";
        this.menuContainer.appendChild(menu);
        menu.appendChild(title);
        menu.appendChild(button);
        menu.appendChild(instructionsButton);
        menu.appendChild(creditsButton);
        button.addEventListener('click', () => {
            menu.remove();
            this.start();
        });
        instructionsButton.addEventListener('click', () => {
            menu.remove();
            this.showInstructions();
        });
        creditsButton.addEventListener('click', () => {
            menu.remove();
            this.showCredits();
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.fetchNotesForSong();
            this.timer = new Timer();
            this.timer.startTimer();
            this.audioPlayer.play();
            this.scoreboard = new Scoreboard();
            this.scoreboard.setScore(0);
            this.pauseButton = document.createElement("button");
            this.pauseButton.innerText = "PAUSE";
            this.pauseButton.setAttribute('class', 'button --pause');
            this.menuContainer.appendChild(this.pauseButton);
            this.pauseButton.addEventListener('click', () => { this.pauseGame(); });
            this.notes.forEach(note => {
                this.bullets.push(new Bullet(note.title, note.time));
            });
            this.songTitle.style.opacity = "100%";
            this.songTitle.children[0].style.opacity = "100%";
            this.songTitle.children[1].style.opacity = "100%";
            setTimeout(() => {
                this.songTitle.style.opacity = "0%";
                this.songTitle.children[0].style.opacity = "0%";
                this.songTitle.children[1].style.opacity = "0%";
            }, 2000);
            this.gameLoop();
        });
    }
    showInstructions() {
        this.instructions = new Instructions();
    }
    showCredits() {
        this.credits = new Credits();
    }
    showFinish() {
        this.audioPlayer.fadeOut();
        this.finish = new Finish();
    }
    pauseGame() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.audioPlayer.pause();
            this.timer.stopTimer();
            this.pauseMenu = new PauseMenu();
        }
        else {
            this.audioPlayer.play();
            this.gameLoop();
            this.timer.startTimer();
            this.pauseMenu.remove();
        }
    }
    stopGame() {
        console.log('hoi');
        this.points = 0;
        this.isPaused = false;
        this.bullets.forEach(bullet => {
            bullet.remove();
        });
        this.scoreboard.remove();
        this.pauseButton.remove();
        this.timer.remove();
        this.bullets = [];
        this.notes = [];
        this.audioPlayer.stop();
        this.createMenu();
    }
    fetchNotesForSong() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch("notes/perfect.json")
                .then(response => response.json())
                .then(json => { this.notes = json.notes; });
        });
    }
    gameLoop() {
        for (const bullet of this.bullets) {
            for (const otherBullet of this.bullets) {
                if (bullet !== otherBullet) {
                    if (bullet.hasCollision(this.bar)) {
                        if (this.notes[this.notes.length - 1].time === bullet.time) {
                            setTimeout(() => {
                                console.log(this.notes[this.notes.length - 1].time, bullet.time);
                                this.showFinish();
                            }, 2000);
                        }
                        if (!this.pitchdetect.active) {
                            this.pitchdetect.activate();
                        }
                        else {
                            if (!bullet.pointWasGiven) {
                                bullet.style.backgroundColor = "#e2eaff";
                                if (bullet._position.y >= (document.getElementById('bar').getBoundingClientRect().top + (document.getElementById('bar').getBoundingClientRect().height / 4))) {
                                    if (this.pitchdetect.note !== null) {
                                        if (this.pitchdetect.outputNote === bullet.note) {
                                            bullet.style.backgroundColor = "#00ee00";
                                            bullet.style.boxShadow = "0 0 30px 1px #00ee00";
                                            this.points++;
                                        }
                                        else {
                                            bullet.style.backgroundColor = "red";
                                            bullet.style.boxShadow = "0 0 30px 1px red";
                                            this.points--;
                                        }
                                    }
                                    else {
                                        bullet.style.backgroundColor = "#222222";
                                        bullet.style.boxShadow = "0 0 0 0";
                                        this.points -= 1;
                                    }
                                    this.scoreboard.setScore(this.points);
                                    bullet.pointWasGiven = true;
                                }
                            }
                        }
                    }
                    else {
                        bullet.style.boxShadow = "0 0 30px 1px #3c00ff";
                        bullet.style.backgroundColor = "white";
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
window.addEventListener("load", () => Main.getInstance());
class PauseMenu extends HTMLElement {
    constructor() {
        var _a;
        super();
        this.setAttribute('class', 'pause-menu');
        this.main = Main.getInstance();
        const resumeButton = document.createElement('button');
        resumeButton.innerText = "RESUME";
        resumeButton.addEventListener('click', () => { this.main.pauseGame(); this.remove(); });
        this.appendChild(resumeButton);
        const stopButton = document.createElement('button');
        stopButton.setAttribute('class', 'stop');
        stopButton.innerText = "STOP";
        stopButton.addEventListener('click', () => { this.main.stopGame(); this.remove(); });
        this.appendChild(stopButton);
        (_a = document.getElementById('menu-container')) === null || _a === void 0 ? void 0 : _a.appendChild(this);
    }
}
window.customElements.define("pausemenu-component", PauseMenu);
class Scoreboard extends HTMLElement {
    constructor() {
        var _a;
        super();
        this.score = 0;
        this.scoreIncreases = false;
        this.setAttribute('style', 'height: fit-content; width: fit-content; z-index: 1; color: white; position: absolute; top: 0; right: 25px; text-align: right;');
        this.innerHTML = `<h2>Score: ${this.score.toString()}</h2>`;
        (_a = document.getElementById('menu-container')) === null || _a === void 0 ? void 0 : _a.appendChild(this);
    }
    setScore(score) {
        this.scoreIncreases = score > this.score;
        this.score = score;
        this.innerHTML = `<h2>Score: ${this.score.toString()}</h2>`;
        this.changeColor(this.scoreIncreases);
        setTimeout(() => {
            this.style.color = "white";
        }, 500);
    }
    getScore() {
        return this.score;
    }
    changeColor(positive) {
        if (positive) {
            this.style.color = "green";
            if (((this.score).toString().length > 1) &&
                ((this.score) > 0) &&
                (parseInt((this.score).toString().slice(-1)) === 0)) {
                this.style.color = "yellow";
            }
        }
        else {
            this.style.color = "red";
        }
    }
}
window.customElements.define("scoreboard-component", Scoreboard);
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