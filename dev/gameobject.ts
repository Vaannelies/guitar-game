class GameObject extends HTMLElement{
    // Fields
    private static numberOfShips : number = 0

    private _position       : Vector 
    private speed           : Vector
    private rotation        : number = 0
    private rotationSpeed   : number = 0
    
    private counter         : number = 60

    private colors          : string[] = ["Green", "Blue", "Orange", "White", "Black", "Red"]
    private _color          : string   = ""
    // Properties
    public get position()   : Vector    { return this._position }
    public get color()      : string    { return this._color    }

    constructor() {
        super()

        this._position  = new Vector(
                            Math.random() * window.innerWidth   - this.clientWidth, 
                            Math.random() * window.innerHeight  - this.clientHeight)
        this.speed      = new Vector(2, 4)
        this.rotation   = 90
        
        this.createShip()
    }

    private createShip() {
        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this)

        GameObject.numberOfShips++
        if(GameObject.numberOfShips > 6) GameObject.numberOfShips = 1
        this.style.backgroundImage = `url(images/ship${GameObject.numberOfShips + 3}.png)`
        this._color = this.colors[GameObject.numberOfShips - 1]
    }

    public update() {
        this._position.x += Math.cos(this.degToRad(this.rotation)) * this.speed.x
        this._position.y += Math.sin(this.degToRad(this.rotation)) * this.speed.y

        // this.turn()
        // this.keepInWindow()
        
        this.draw()
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

    public hasCollision(ship : GameObject) : boolean {
        return (ship._position.x < this._position.x + this.clientWidth &&
                ship._position.x + ship.clientWidth > this._position.x &&
                ship._position.y < this._position.y + this.clientHeight &&
                ship._position.y + ship.clientHeight > this._position.y)
    }
}