var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Messageboard = /** @class */ (function (_super) {
    __extends(Messageboard, _super);
    // private ui
    function Messageboard() {
        var _this = _super.call(this) || this;
        var game = document.getElementsByTagName("game")[0];
        game.appendChild(_this);
        // this.addMessage()
        console.log("Hoi");
        return _this;
    }
    Messageboard.getInstance = function () {
        if (!Messageboard.instance)
            Messageboard.instance = new Messageboard();
        return Messageboard.instance;
    };
    Messageboard.prototype.addMessage = function (m) {
        console.log("Hoi2");
        var item = document.createElement("LI");
        item.innerHTML = m;
        this.appendChild(item);
    };
    return Messageboard;
}(HTMLElement));
window.addEventListener("load", function () { return Messageboard.getInstance(); });
window.customElements.define("messageboard-component", Messageboard);
