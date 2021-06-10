class Timer extends HTMLElement {
// https://dev.to/gspteck/create-a-stopwatch-in-javascript-2mak

    public min: any= 0;
    public sec: any = 0;
    public ms: any = 0;
    public stoptime: boolean = true;
    // private timer: HTMLElement;

    constructor() {
        super()
        this.innerHTML = '<h2></h2>'
        document.getElementById('menu-container')?.appendChild(this)
        this.setAttribute('style', 'z-index: 1; color: white; position: absolute; top: 0; left: 25px;')
    }

    startTimer() {
    if (this.stoptime == true) {
            this.stoptime = false;
            this.timerCycle();
        }
    }
    stopTimer() {
        if (this.stoptime == false) {
            this.stoptime = true;
        }
    }

    public timerCycle() {
        if (this.stoptime == false) {
       this.ms = parseInt(this.ms);
       this.sec = parseInt(this.sec);
       this.min = parseInt(this.min);

       this.ms = this.ms + 1;

        if (this.ms == 60) {
       this.sec = this.sec + 1;
       this.ms = 0;
       }
       if (this.sec == 60 && this.ms == 0) {
       this.min = this.min + 1;
       this.sec = 0;
       this.ms = 0;
        }

        if (this.ms < 10 || this.ms == 0) {
        this.ms = '0' + this.ms;
        }
        if (this.sec < 10 || this.sec == 0) {
        this.sec = '0' + this.sec;
        }
        if (this.min < 10 || this.min == 0) {
        this.min = '0' + this.min;
        }

        this.innerHTML = '<h2>' + this.min + ':' + this.sec + ':' + this.ms + '</h2>';
        // console.log( this.min + ':' + this.sec + ':' + this.ms);
        setTimeout(() => {this.timerCycle()}, 10);
    }
}

public resetTimer() {
    this.innerHTML = '<h2>00:00:00</h2>';
    this.stoptime = true;
    this.min = 0;
    this.ms = 0;
    this.sec = 0;
}
}


window.customElements.define("timer-component", Timer as any)
