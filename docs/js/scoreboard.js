"use strict";
class Scoreboard extends HTMLElement {
    constructor() {
        var _a;
        super();
        this.score = 0;
        this.scoreIncreases = false;
        this.setAttribute('style', 'height: fit-content; width: fit-content; z-index: 1; color: white; position: absolute; top: 0; right: 25px; text-align: right;');
        this.innerHTML = `<h2>Score: ${this.score.toString()}</h2>`;
        (_a = document.getElementById('menu-container')) === null || _a === void 0 ? void 0 : _a.appendChild(this);
    }
    setScore(score) {
        this.scoreIncreases = score > this.score;
        this.score = score;
        this.innerHTML = `<h2>Score: ${this.score.toString()}</h2>`;
        this.changeColor(this.scoreIncreases);
        setTimeout(() => {
            this.style.color = "white";
        }, 500);
    }
    getScore() {
        return this.score;
    }
    changeColor(positive) {
        if (positive) {
            this.style.color = "green";
            if (((this.score).toString().length > 1) &&
                ((this.score) > 0) &&
                (parseInt((this.score).toString().slice(-1)) === 0)) {
                this.style.color = "yellow";
            }
        }
        else {
            this.style.color = "red";
        }
    }
}
window.customElements.define("scoreboard-component", Scoreboard);
//# sourceMappingURL=scoreboard.js.map