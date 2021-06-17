class Instructions extends HTMLElement {
    private main: Main;

    constructor() {
        super()
        this.setAttribute('class', 'pause-menu')
        this.main = Main.getInstance()

        
        const text = document.createElement('div')
        text.innerHTML= "<h2>HOW TO PLAY?</h2><p>Listen to the music and hit the right notes as they reach the bottom of the screen.<br><br>Grab your guitar and play along!</p><p style='font-size: 14px'>Tip: Use earphones so your microphone won't pick up the sound of the game."
        this.appendChild(text)


        const button = document.createElement('button')
        button.setAttribute('class', 'back')
        button.innerText = "BACK"
        button.addEventListener('click', ()=>{this.main.createMenu(); this.remove();})
        this.appendChild(button)
        

        document.getElementById('menu-container')?.appendChild(this)

    }

}


window.customElements.define("instructions-component", Instructions)