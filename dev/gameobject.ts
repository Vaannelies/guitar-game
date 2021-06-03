// / <reference path="vector.ts" />

class GameObject extends HTMLElement {
    // Fields

    
    private static numberOfBullets : number = 0

    public _position       : Vector 
    public speed           : number
    public rotation        : number = 0

    // Properties
    public get position()   : Vector    { return this._position }

    constructor() {
        super()

        this.speed      = ((document.getElementById('bar').getBoundingClientRect()?.top) / 4)
        this._position  = new Vector(
                            Math.random() * window.innerWidth   - this.clientWidth, 
                            0)
        this.rotation   = 0
        this.createBullet()
    }

    private createBullet() {
        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this)

        GameObject.numberOfBullets++
        if(GameObject.numberOfBullets > 6) GameObject.numberOfBullets = 1
        this.style.backgroundColor = "white";
        this.style.height = "10vh";
        this.style.minHeight = "40px";
        this.style.width = "10vh"
        this.style.minWidth = "40px"
        this.style.borderRadius = "100px";
        this.style.transition = "box-shadow 0.2s ease, background-color 0.2s ease"
        this.style.boxShadow = "0 0 30px 1px #3c00ff";
    }

    public draw() {
        this.style.transform = `translate(${this._position.x}px, ${this._position.y}px) rotate(${this.rotation}deg)`
    }

    public hasCollision(bar : any) : boolean {
        return (
            document.getElementById('bar').getBoundingClientRect()?.top < (this._position.y + this.clientHeight) &&
            document.getElementById('bar').getBoundingClientRect()?.bottom > (this._position.y - this.clientHeight))
    }
}