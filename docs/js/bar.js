"use strict";
class Bar extends HTMLElement {
    constructor() {
        var _a;
        super();
        const bar = document.createElement('div');
        bar.setAttribute('id', 'bar');
        bar.setAttribute('style', 'position: absolute; bottom: 0; width: 100%; background: white; height: 10vh; min-height: 40px; z-index: -1; border-top: 2px solid  #ccddFF; box-shadow: 0 0 10px 1px  #ccddFF;');
        (_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.appendChild(bar);
    }
}
window.customElements.define("bar-component", Bar);
//# sourceMappingURL=bar.js.map