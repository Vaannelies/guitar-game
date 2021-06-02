/// <reference path="gameobject.ts" />

class Bar extends HTMLElement {
    // Fields
    // private captain         : Captain

    private numberOfHits    : number = 0
    private _hit: boolean = false
    private _position       : Vector 
    private previousHit     : boolean = false
    private note: string

    // Properties
    public set hit(value: boolean)  { this._hit = value     }

    constructor() {
        super()

        const bar = document.createElement('div')
        bar.setAttribute('id', 'bar')
        bar.setAttribute('style', 'position: absolute; bottom: 0; width: 100%; background: white; height: 10vh; min-height: 40px; z-index: -1; border-top: 2px solid  #ccddFF; box-shadow: 0 0 10px 1px  #ccddFF;')
        // banner.innerHTML = this.note;
        document.querySelector('body')?.appendChild(bar)
        this._position  = new Vector(
           0,
            window.innerHeight)

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
            // console.log(`${this.color} pirateship got hit ${this.numberOfHits} ${times}!`)
            // Messageboard.getInstance().addMessage(`${this.color} pirateship got hit ${this.numberOfHits} ${times}!`)
        }

        this.previousHit = this._hit
    }
}

window.customElements.define("bar-component", Bar)