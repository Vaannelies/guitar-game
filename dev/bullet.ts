/// <reference path="gameobject.ts" />

class Bullet extends GameObject {
    public note: string
    public time: {min: string, sec: string, ms: string}
    private main: Main

    constructor(note: string,  time: {min: string, sec: string, ms: string}) {
        super()
        this.time = time;
        this.note = note;

        this.main = Main.getInstance()

        this._position =  new Vector(
            Math.random() * window.innerWidth   - this.clientWidth, 
            this.clientHeight - ((this.main.audioPlayer.audio.duration - parseInt(this.time.sec) ) * this.speed) )
        this.style.display = "flex";
        this.style.justifyContent = "center";
        this.style.alignItems = "center";
        const banner = document.createElement('span')
        banner.innerHTML = this.note;
        this.appendChild(banner)
        this.moveBullet();
    }

    public moveBullet() {
        this._position.y =
         (((this.main.audioPlayer.audio.currentTime%60) - ((parseInt(this.time.sec) + (parseInt(this.time.ms)/100)) - 4)) * this.speed)
        this.draw()
        setTimeout(() => {this.moveBullet()}, 100)
    }
    
    public draw() {
        this.style.transform = `translate(${this._position.x}px, ${this._position.y}px) rotate(${this.rotation}deg)`
    }
}

window.customElements.define("bullet-component", Bullet)