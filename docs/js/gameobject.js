"use strict";
class GameObject extends HTMLElement {
    constructor() {
        var _a;
        super();
        this.rotation = 0;
        this.speed = (((_a = document.getElementById('bar').getBoundingClientRect()) === null || _a === void 0 ? void 0 : _a.top) / 4);
        this._position = new Vector(0, 0);
        this.rotation = 0;
        this.createBullet();
    }
    get position() { return this._position; }
    createBullet() {
        let game = document.getElementsByTagName("game")[0];
        this.setAttribute('class', 'bullet');
        game.appendChild(this);
        this._position = new Vector(Math.random() * window.innerWidth - this.clientWidth, 0);
        GameObject.numberOfBullets++;
        if (GameObject.numberOfBullets > 6)
            GameObject.numberOfBullets = 1;
    }
    draw() {
        this.style.transform = `translate(${this._position.x}px, ${this._position.y}px) rotate(${this.rotation}deg)`;
    }
    hasCollision(bar) {
        var _a, _b;
        return (((_a = document.getElementById('bar').getBoundingClientRect()) === null || _a === void 0 ? void 0 : _a.top) < (this._position.y + this.clientHeight) &&
            ((_b = document.getElementById('bar').getBoundingClientRect()) === null || _b === void 0 ? void 0 : _b.bottom) > (this._position.y - this.clientHeight));
    }
}
GameObject.numberOfBullets = 0;
//# sourceMappingURL=gameobject.js.map