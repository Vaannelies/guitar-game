/// <reference path="gameobject.ts" />

class Bullet extends GameObject {
    // Fields
    // private captain         : Captain

    private numberOfHits    : number = 0
    private _hit: boolean = false
    
    private previousHit     : boolean = false
    public note: string

    // Properties
    public set hit(value: boolean)  { this._hit = value     }

    constructor(note: string) {
        super()
        this.note = note;
        this.style.display = "flex";
        this.style.justifyContent = "center";
        this.style.alignItems = "center";
        const banner = document.createElement('span')
        banner.innerHTML = this.note;
        this.appendChild(banner)
        // this.captain = new Captain(this)
        console.log(note)
    }

    public update() {
        this.checkCollision()

        // this.captain.update()

        super.update()
    }

    private checkCollision() {
        if(this._hit && !this.previousHit) {
            // this.captain.onCollision(++this.numberOfHits)
            let times = this.numberOfHits == 1 ? "time" : "times"
            console.log(`${this.color} pirateship got hit ${this.numberOfHits} ${times}!`)
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