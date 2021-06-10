"use strict";
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
//# sourceMappingURL=bullet.js.map