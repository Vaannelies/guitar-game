class Finish extends HTMLElement {
    private main: Main;

    constructor() {
        super()
        this.setAttribute('class', 'pause-menu')
        this.main = Main.getInstance()

        
        const text = document.createElement('div')
        text.innerHTML = `<h2>Well done!</h2><p>Score: ${this.main.points}</p>`
        this.appendChild(text)


        const stopButton = document.createElement('button')
        stopButton.innerText = "OK"
        stopButton.addEventListener('click', ()=>{this.main.stopGame(); this.remove();})
        this.appendChild(stopButton)
        

        document.getElementById('menu-container')?.appendChild(this)
    }
}


window.customElements.define("finish-component", Finish)