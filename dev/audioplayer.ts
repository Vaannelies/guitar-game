class AudioPlayer extends HTMLElement {
    private audio: HTMLAudioElement;
    public paused: boolean = false;

    constructor() {
        super()
        this.audio = new Audio('./audio/perfect.mp3');
    }
    
    public play() {
        this.paused = false;
        const startPlayPromise = this.audio.play();

        if(startPlayPromise !== undefined) {
           startPlayPromise.then(() => {
               // toppie
           }).catch(error => {
               if(error.name === 'NotAllowedError') {
                   this.play();
               } else {
                   console.log("Error: ", error);
               }
           })
        }
    }

    public pause() {
        this.audio.pause();
        this.paused = true;
    }

    public stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }
}

window.customElements.define("audioplayer-component", AudioPlayer as any)
