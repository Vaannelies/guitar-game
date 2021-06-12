class Credits extends HTMLElement {
    private main: Main;

    constructor() {
        super()
        this.setAttribute('class', 'pause-menu')
        this.main = Main.getInstance()

        
        const text = document.createElement('div')
        text.innerHTML= "<h2>CREDITS</h2><p>Song: <a href='https://www.youtube.com/watch?v=2Vv-BfVoq4g' target='_blank'>Perfect by Ed Sheeran</a><br><br>This game was created by Annelies Vaandrager</p>"
        this.appendChild(text)


        const button = document.createElement('button')
        button.setAttribute('class', 'back')
        button.innerText = "BACK"
        // stopButton.setAttribute('class', 'button --pauseMenu')
        button.addEventListener('click', ()=>{this.main.createMenu(); this.remove();})
        this.appendChild(button)
        

        document.getElementById('menu-container')?.appendChild(this)

    }

}


window.customElements.define("credits-component", Credits)