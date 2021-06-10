"use strict";
class AudioPlayer extends HTMLElement {
    constructor() {
        super();
        this.audio = new Audio('./audio/perfect.mp3');
    }
    play() {
        const startPlayPromise = this.audio.play();
        if (startPlayPromise !== undefined) {
            startPlayPromise.then(() => {
            }).catch(error => {
                if (error.name === 'NotAllowedError') {
                    this.play();
                }
                else {
                    console.log("Error: ", error);
                }
            });
        }
    }
    pause() {
        this.audio.pause();
    }
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }
}
window.customElements.define("audioplayer-component", AudioPlayer);
//# sourceMappingURL=audioplayer.js.map