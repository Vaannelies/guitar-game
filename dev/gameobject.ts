// / <reference path="vector.ts" />

class GameObject extends HTMLElement{
    // Fields
    private static numberOfShips : number = 0

    private _position       : Vector 
    private speed           : number
    private rotation        : number = 0
    // private rotationSpeed   : number = 0
    
    // private counter         : number = 60

    private colors          : string[] = ["Green", "Blue", "Orange", "White", "Black", "Red"]
    private _color          : string   = ""
    // Properties
    public get position()   : Vector    { return this._position }
    public get color()      : string    { return this._color    }

    constructor() {
        super()

        console.log('clientheight', document.documentElement.clientHeight);
        console.log("this.clientheight", this.clientHeight);
        console.log('windowinnerheight', window.innerHeight)

        this._position  = new Vector(
                            Math.random() * window.innerWidth   - this.clientWidth, 
                            this.clientHeight)
        // this.speed      = ((window.innerHeight - document.getElementById('bar').getBoundingClientRect()?.height) / 200)
        this.speed      = ((document.getElementById('bar').getBoundingClientRect()?.top) / 40)
        this.rotation   = 0
        console.log(document.getElementById('bar').getBoundingClientRect())
        this.createShip()
    }

    private createShip() {
        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this)
        // this.setAttribute('style', 'height = 10vh; min-height: 40px');
     
        GameObject.numberOfShips++
        if(GameObject.numberOfShips > 6) GameObject.numberOfShips = 1
        this.style.backgroundColor = "white";
        this.style.height = "10vh";
        this.style.minHeight = "40px";
        this.style.width = "10vh"
        this.style.minWidth = "40px"
        this.style.borderRadius = "100px";
        this.style.boxShadow = "0 0 50px 5px blue";

        this._color = this.colors[GameObject.numberOfShips - 1]
        this.moveBullet();
        
    }

    public moveBullet() {
        this._position.y += this.speed; 
        this.draw()
        setTimeout(() => {this.moveBullet()}, 100)
    }

    public update() {
        // this._position.x += Math.cos(this.degToRad(this.rotation)) * this.speed.x
        
        // this.turn()
        // this.keepInWindow()
       
        
        // setTimeout(() => { this._position.y += this.speed; this.draw()}, 1000)
    }

    // private turn() {
    //     this.counter++
    //     if(this.counter > 60) {
    //         this.counter = 0

    //         this.rotationSpeed = Math.round(Math.random() * 3 )
    //         this.rotationSpeed *= Math.random() < 0.5 ? -1 : 1
    //     }
    //     this.rotation += this.rotationSpeed
    // }

    // private keepInWindow() {
    //     if(this._position.x + this.clientWidth < 0)  this._position.x = window.innerWidth
    //     if(this._position.y + this.clientHeight< 0)  this._position.y = window.innerHeight
    //     if(this._position.x > window.innerWidth)     this._position.x = 0
    //     if(this._position.y > window.innerHeight)    this._position.y = 0
    // }

    private draw() {
        this.style.transform = `translate(${this._position.x}px, ${this._position.y}px) rotate(${this.rotation}deg)`
    }

    /**
     * Converts angle from degrees to radians
     * @param degrees angle in degrees
     */
    private degToRad(degrees : number) {
        return degrees * Math.PI / 180
    }

    public hasCollision(bar : any) : boolean {
        return (
            document.getElementById('bar').getBoundingClientRect()?.top < (this._position.y + this.clientHeight) &&
            document.getElementById('bar').getBoundingClientRect()?.bottom > (this._position.y - this.clientHeight))
    }

         // bullet moet op px = window.innerheight - barHeight zijn op moment x 
        // bullet moet 500 px hoger spawnen dan px
        // bullet moet er 4 seconden over doen  
        // dan moet bullet elke seconde 500/4 = 125 px verschuiven 
        // dus elke 0,1 seconde moet ie 12,5px verschuiven


        // bullet moet op px = window.innerheight - barHeight zijn op moment x 
       // bullet moet op window.innerheight spawnen, dus 0 px.
       // bullet moet er 4 seconden over doen  
       // dan moet bullet elke seconde ((window.innerheight - barHeight) / 4 ) = .... px verschuiven 
       // dus elke 0,1 seconde moet ie 0,.... px verschuiven
    }