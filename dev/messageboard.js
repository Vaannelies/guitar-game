"use strict";
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
//# sourceMappingURL=messageboard.js.map