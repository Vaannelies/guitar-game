class AudioPlayer extends HTMLElement {
    public audio: HTMLAudioElement;

    constructor() {
        super()
        this.audio = new Audio('./audio/perfect.mp3');
        this.audio.setAttribute('id', 'audio');
    }
    
    public play() {
        const startPlayPromise = this.audio.play();

        if(startPlayPromise !== undefined) {
           startPlayPromise.then(() => {
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
    }

    public stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }
    public fadeOut() {
        setTimeout(() => {
            this.audio.volume = 0.8;
            setTimeout(() => {
                this.audio.volume = 0.6;
                setTimeout(() => {
                    this.audio.volume = 0.4;
                    setTimeout(() => {
                        this.audio.volume = 0.2;
                        setTimeout(() => {
                            this.audio.volume = 0.0;
                        }, 300);
                    }, 300);
                }, 300);
            }, 300);
        }, 300);
    }
}

window.customElements.define("audioplayer-component", AudioPlayer as any)
