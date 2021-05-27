class Messageboard extends HTMLElement {
    private static instance : Messageboard

    // private ui
    private constructor() {
        super()
        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this)

        // this.addMessage()
        console.log("Hoii")

    }

    public static getInstance() : Messageboard {
        if(!Messageboard.instance) Messageboard.instance = new Messageboard()
        return Messageboard.instance
    }

    public addMessage(m : string) {
        console.log("Hoi2")
            let item = document.createElement("LI")
           
            item.innerHTML = m
            this.appendChild(item)
    }
}
window.addEventListener("load", () => Messageboard.getInstance())
window.customElements.define("messageboard-component", Messageboard as any)
