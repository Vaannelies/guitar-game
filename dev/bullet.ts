/// <reference path="gameobject.ts" />

class Bullet extends GameObject {
    // Fields
    private captain         : Captain

    private numberOfHits    : number = 0
    private _hit: boolean = false
    
    private previousHit     : boolean = false
    private note: string

    // Properties
    public set hit(value: boolean)  { this._hit = value     }

    constructor(note: string) {
        super()
        this.note = note;
        const banner = document.createElement('span')
        banner.innerHTML = this.note;
        this.appendChild(banner)
        this.captain = new Captain(this)
    }

    public update() {
        this.checkCollision()

        this.captain.update()

        super.update()
    }

    private checkCollision() {
        if(this._hit && !this.previousHit) {
            this.captain.onCollision(++this.numberOfHits)

            let times = this.numberOfHits == 1 ? "time" : "times"
            console.log(`${this.color} pirateship got hit ${this.numberOfHits} ${times}!`)
            Messageboard.getInstance().addMessage(`${this.color} pirateship got hit ${this.numberOfHits} ${times}!`)
        }

        this.previousHit = this._hit
    }
}

window.customElements.define("ship-component", Bullet)