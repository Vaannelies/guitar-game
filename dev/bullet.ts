/// <reference path="gameobject.ts" />

class Bullet extends GameObject {
    // Fields
    // private captain         : Captain

    private numberOfHits    : number = 0
    private _hit: boolean = false
    
    private previousHit     : boolean = false
    public note: string
    public time: {min: string, sec: string, ms: string}
    private main: Main
    // Properties
    public set hit(value: boolean)  { this._hit = value     }

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
        // this.captain = new Captain(this)
        // console.log(note)
        this.moveBullet();
    }

    public update() {

        this.checkCollision()

        // this.captain.update()

        // super.update()
    }

    public moveBullet() {
        // console.log(this.main.audioPlayer.audio.currentTime%60)
        this._position.y =
         (((this.main.audioPlayer.audio.currentTime%60) - ((parseInt(this.time.sec) + (parseInt(this.time.ms)/100)) - 4)) * this.speed)
    
        // this._position.y += this.speed; 
        this.draw()
        // if(Ti)
        // console.log(this.clientHeight)
        setTimeout(() => {this.moveBullet()}, 100)
    }
    
    
    public draw() {
        this.style.transform = `translate(${this._position.x}px, ${this._position.y}px) rotate(${this.rotation}deg)`
    }

    
    private checkCollision() {
        if(this._hit && !this.previousHit) {
            // this.captain.onCollision(++this.numberOfHits)
            let times = this.numberOfHits == 1 ? "time" : "times"
            // console.log(`${this.color} pirateship got hit ${this.numberOfHits} ${times}!`)
            Messageboard.getInstance().addMessage(`${this.color} pirateship got hit ${this.numberOfHits} ${times}!`)
        }

        this.previousHit = this._hit
    }


    hoi() {

        // bullet moet op px = window.innerheight - barHeight zijn op moment x 
        // bullet moet 500 px hoger spawnen dan px
        // bullet moet er 4 seconden over doen  
        // dan moet bullet elke seconde 500/4 = 125 px verschuiven 
        // dus elke 0,1 seconde moet ie 12,5px verschuiven
    }
}

window.customElements.define("ship-component", Bullet)