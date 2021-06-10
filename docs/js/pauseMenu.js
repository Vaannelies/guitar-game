"use strict";
class PauseMenu extends HTMLElement {
    constructor() {
        var _a;
        super();
        this.setAttribute('class', 'pause-menu');
        this.main = Main.getInstance();
        const resumeButton = document.createElement('button');
        resumeButton.innerText = "RESUME";
        resumeButton.addEventListener('click', () => { this.main.pauseGame(); this.remove(); });
        this.appendChild(resumeButton);
        const stopButton = document.createElement('button');
        stopButton.setAttribute('class', 'stop');
        stopButton.innerText = "STOP";
        stopButton.addEventListener('click', () => { this.main.stopGame(); this.remove(); });
        this.appendChild(stopButton);
        (_a = document.getElementById('menu-container')) === null || _a === void 0 ? void 0 : _a.appendChild(this);
    }
}
window.customElements.define("pausemenu-component", PauseMenu);
//# sourceMappingURL=pauseMenu.js.map