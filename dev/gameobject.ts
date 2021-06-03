// / <reference path="vector.ts" />

class GameObject extends HTMLElement {
    private static numberOfBullets : number = 0

    public _position       : Vector 
    public speed           : number
    public rotation        : number = 0

    public get position()   : Vector    { return this._position }

    constructor() {
        super()

        this.speed = ((document.getElementById('bar').getBoundingClientRect()?.top) / 4)
        this._position  = new Vector(
                            Math.random() * window.innerWidth   - this.clientWidth, 
                            0)
        this.rotation = 0
        this.createBullet()
    }

    private createBullet() {
        let game = document.getElementsByTagName("game")[0]
        this.setAttribute('class', 'bullet')
        game.appendChild(this)

        GameObject.numberOfBullets++
        if(GameObject.numberOfBullets > 6) GameObject.numberOfBullets = 1
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