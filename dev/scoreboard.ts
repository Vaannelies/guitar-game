class Scoreboard extends HTMLElement {
    private score: number = 0;
    private scoreIncreases: boolean = false;

    constructor() {
        super()
        // this. = document.createElement('h1');
        this.setAttribute('style', 'height: fit-content; width: fit-content; z-index: 1; color: white; position: absolute; top: 0; right: 25px;')
        this.innerHTML = `<h2>Score: ${this.score.toString()}</h2>`
    }
    
    public setScore(score: number) {
        this.scoreIncreases = score > this.score

        this.score = score;
        this.innerHTML = `<h2>Score: ${this.score.toString()}</h2>`

        this.changeColor(this.scoreIncreases)
        setTimeout(() => {
            this.style.color = "white"
        }, 500); 
    }

    public getScore() {
        return this.score;
    }

    private changeColor(positive: boolean) {
        if(positive) {
            this.style.color = "green"
            if(
                ((this.score).toString().length > 1) && 
                ((this.score) > 0) && 
                (parseInt((this.score).toString().slice(-1)) === 0)
            ) 
                {
                    this.style.color = "yellow"
                }
        } else {
            this.style.color = "red"
        }
    }
}


window.customElements.define("scoreboard-component", Scoreboard)