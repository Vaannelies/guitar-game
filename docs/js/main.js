"use strict";
class GameObject extends HTMLElement {
    constructor() {
        super();
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.counter = 60;
        this.colors = ["Green", "Blue", "Orange", "White", "Black", "Red"];
        this._color = "";
        this._position = new Vector(Math.random() * window.innerWidth - this.clientWidth, Math.random() * window.innerHeight - this.clientHeight);
        this.speed = new Vector(2, 4);
        this.rotation = 90;
        this.createShip();
    }
    get position() { return this._position; }
    get color() { return this._color; }
    createShip() {
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
        GameObject.numberOfShips++;
        if (GameObject.numberOfShips > 6)
            GameObject.numberOfShips = 1;
        this.style.backgroundImage = `url(images/ship${GameObject.numberOfShips + 3}.png)`;
        this._color = this.colors[GameObject.numberOfShips - 1];
    }
    update() {
        this._position.x += Math.cos(this.degToRad(this.rotation)) * this.speed.x;
        this._position.y += Math.sin(this.degToRad(this.rotation)) * this.speed.y;
        this.draw();
    }
    draw() {
        this.style.transform = `translate(${this._position.x}px, ${this._position.y}px) rotate(${this.rotation}deg)`;
    }
    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
    hasCollision(ship) {
        return (ship._position.x < this._position.x + this.clientWidth &&
            ship._position.x + ship.clientWidth > this._position.x &&
            ship._position.y < this._position.y + this.clientHeight &&
            ship._position.y + ship.clientHeight > this._position.y);
    }
}
GameObject.numberOfShips = 0;
class Bullet extends GameObject {
    constructor() {
        super();
        this.numberOfHits = 0;
        this._hit = false;
        this.previousHit = false;
        this.captain = new Captain(this);
    }
    set hit(value) { this._hit = value; }
    update() {
        this.checkCollision();
        this.captain.update();
        super.update();
    }
    checkCollision() {
        if (this._hit && !this.previousHit) {
            this.captain.onCollision(++this.numberOfHits);
            let times = this.numberOfHits == 1 ? "time" : "times";
            console.log(`${this.color} pirateship got hit ${this.numberOfHits} ${times}!`);
            Messageboard.getInstance().addMessage(`${this.color} pirateship got hit ${this.numberOfHits} ${times}!`);
        }
        this.previousHit = this._hit;
    }
}
window.customElements.define("ship-component", Bullet);
class Messageboard extends HTMLElement {
    constructor() {
        super();
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
        console.log("Hoi");
    }
    static getInstance() {
        if (!Messageboard.instance)
            Messageboard.instance = new Messageboard();
        return Messageboard.instance;
    }
    addMessage(m) {
        console.log("Hoi2");
        let item = document.createElement("LI");
        item.innerHTML = m;
        this.appendChild(item);
    }
}
window.addEventListener("load", () => Messageboard.getInstance());
window.customElements.define("messageboard-component", Messageboard);
class Captain extends HTMLElement {
    constructor(ship) {
        super();
        this.ship = ship;
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
    }
    update() {
        let x = this.ship.position.x + this.ship.clientWidth / 2;
        let y = this.ship.position.y;
        this.style.transform = `translate(${x}px, ${y}px) rotate(${0}deg)`;
    }
    onCollision(numberOfHits) {
        if (numberOfHits == 1) {
            this.style.backgroundImage = `url(images/emote_alert.png)`;
            console.log(`Captain of ${this.ship.color} pirateship WOKE UP!`);
            Messageboard.getInstance().addMessage(`Captain of ${this.ship.color} pirateship WOKE UP!`);
        }
        else if (numberOfHits == 7) {
            this.style.backgroundImage = `url(images/emote_faceAngry.png)`;
            console.log(`Captain of ${this.ship.color} pirateship got ANGRY!`);
            Messageboard.getInstance().addMessage(`Captain of ${this.ship.color} pirateship got ANGRY!`);
        }
    }
}
window.customElements.define("captain-component", Captain);
class Vector {
    constructor(x, y) {
        this._x = 0;
        this._y = 0;
        this._x = x;
        this._y = y;
    }
    get x() { return this._x; }
    set x(value) { this._x = value; }
    get y() { return this._y; }
    set y(value) { this._y = value; }
}
//# sourceMappingURL=main.js.map