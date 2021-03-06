class Scoreboard extends HTMLElement {
    private score: number = 0;
    private oldScore: number = 0;
    private scoreIncreases: boolean = false;

    constructor() {
        super()
        // this. = document.createElement('h1');
        this.setAttribute('style', 'height: fit-content; width: fit-content; z-index: 1; color: white; position: absolute; top: 0; right: 25px; text-align: right;')
        this.innerHTML = `<h2>Score: ${this.score.toString()}</h2>`
        // document.body.appendChild(this);
        document.getElementById('menu-container')?.appendChild(this);
    }
    
    public setScore(score: number) {
        this.scoreIncreases = score > this.score
        this.oldScore = this.score
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
                (((this.score).toString()).length > 3) && 
                ((this.score) > 0) && 
                ((parseInt((this.score).toString()[((this.score).toString()).length - 4]) > parseInt((this.oldScore).toString()[((this.oldScore).toString()).length - 4]) )
                || (((this.score).toString()).length === 4 && ((this.oldScore).toString()).length === 3 )
            ))
                {
                    this.style.color = "yellow"
                }
        } else {
            this.style.color = "red"
        }
    }
}


window.customElements.define("scoreboard-component", Scoreboard)