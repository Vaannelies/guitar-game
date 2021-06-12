class Instructions extends HTMLElement {
    // private score: number = 0;
    // private scoreIncreases: boolean = false;
    private main: Main;

    constructor() {
        super()
        // this. = document.createElement('h1');
        // this.setAttribute('style', 'height: fit-content; width: fit-content; z-index: 1; color: white; position: absolute; top: 0; right: 25px;')
        // this.setAttribute('style',)
        this.setAttribute('class', 'pause-menu')
        this.main = Main.getInstance()

        
        const text = document.createElement('div')
        text.innerHTML= "<h2>HOW TO PLAY?</h2><p>Listen to the song and hit the right notes as they reach the bottom of the screen.<br><br>Get your guitar and play along!</p>"
        this.appendChild(text)


        const button = document.createElement('button')
        button.setAttribute('class', 'back')
        button.innerText = "BACK"
        // stopButton.setAttribute('class', 'button --pauseMenu')
        button.addEventListener('click', ()=>{this.main.createMenu(); this.remove();})
        this.appendChild(button)
        

        document.getElementById('menu-container')?.appendChild(this)

        // this.innerHTML = `<h2>Score: ${this.score.toString()}</h2>`
    }
    
    // public setScore(score: number) {
    //     this.scoreIncreases = score > this.score

    //     this.score = score;
    //     this.innerHTML = `<h2>Score: ${this.score.toString()}</h2>`

    //     this.changeColor(this.scoreIncreases)
    //     setTimeout(() => {
    //         this.style.color = "white"
    //     }, 500); 
    // }

    // public getScore() {
    //     return this.score;
    // }

    // private changeColor(positive: boolean) {
    //     if(positive) {
    //         this.style.color = "green"
    //         if(
    //             ((this.score).toString().length > 1) && 
    //             ((this.score) > 0) && 
    //             (parseInt((this.score).toString().slice(-1)) === 0)
    //         ) 
    //             {
    //                 this.style.color = "yellow"
    //             }
    //     } else {
    //         this.style.color = "red"
    //     }
    // }
}


window.customElements.define("instructions-component", Instructions)