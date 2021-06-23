"use strict";
class GameObject extends HTMLElement {
    constructor() {
        super();
        this.rotation = 0;

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
//# sourceMappingURL=gameobject.js.map