"use strict";
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
//# sourceMappingURL=bullet.js.map