/// <reference path="messageboard.ts"/>
// / <reference path="pitchdetect.ts"/>

// import PitchDetect from "./pitchdetect";

// import { Stopwatch } from "ts-stopwatch";
// import PitchDetect from './pitchdetect';
// const Stopwatch = require("ts-stopwatch").Stopwatch;

// const Stopwatch = require("ts-stopwatch").Stopwatch;

class Main {
    // const Stopwatch = requestAnimationFrame()
    private audioPlayer: AudioPlayer
    private bullets : Bullet[] = []
    private messageboard : Messageboard
    private timer: Timer
    private isPaused: boolean = false




// public stopwatch: any;



    constructor() {
        // this.stopwatch = new Stopwatch();
        // this.stopwatch.start();
        // console.log(this.stopwatch.getTime())
        // this.stopwatch.stop();
        this.timer = new Timer();
        const pitchdetect: PitchDetect = new PitchDetect();
        console.log(pitchdetect)
        pitchdetect.updatePitch()

        this.createMenu();
    
    }

    createMenu() {
        
        const body = document.querySelector('body');
        const menuContainer = document.createElement("div");
        menuContainer.setAttribute('style', 'height: 100vh; width: 100vw; z-index: 2; position: absolute; top: 0; left: 0; display: flex; justify-content: center; align-items: center');
        // body?.setAttribute('style', 'display: flex; align-items: center;')
        const menu = document.createElement("div");

        menu.setAttribute('style', 'display: flex; justify-content: center; padding: 10px; flex-direction: column; width: 40vw; height: 40vh; background: white; border-radius: 8px; align-items: center;');
        const title = document.createElement("h1");
        title.innerText = 'Are you ready?'
        title.setAttribute('style', 'font-size: 24px; text-align: center;');
        const button = document.createElement("button");
        button.setAttribute('style', 'font-size: 24px; padding: 20px; height: 2em; line-height: 0; background: black; border-radius: 8px; color: white;')
        button.innerText = "START";
        body?.appendChild(menuContainer);
        menuContainer.appendChild(menu)
        menu.appendChild(title)
        menu.appendChild(button)
        button.addEventListener('click', () => {
            menu.remove();
            this.start();
        })


        const pauseButton = document.createElement("button");
        pauseButton.innerText = "PAUSE";
        pauseButton.setAttribute('style', 'position: absolute; top: 10px; font-size: 14px; padding: 8px; background: black; border-radius: 8px; color: white;')
        menuContainer.appendChild(pauseButton)
        pauseButton.addEventListener('click', () => {
            this.isPaused = !this.isPaused
            if(this.audioPlayer.paused) {
                this.audioPlayer.play();
                this.gameLoop();
            } else {
                this.audioPlayer.pause();
            }
            // console.log('paused:', this.isPaused)
        })
    }

    start() {

        this.timer.startTimer();
        this.audioPlayer = new AudioPlayer();
        this.audioPlayer.play();
        for (let i = 0; i < 10; i++) {
            this.bullets.push(new Bullet())
        }
   
        // Eventueel Messageboard aanmaken zodat deze zichtbaar wordt?
        this.messageboard = Messageboard.getInstance()
        console.log(this.messageboard)

        // pitchdetect.toggleLiveInput();

        this.gameLoop()
    }
    
    gameLoop() {
        console.log("yo")
        // pitchdetect.updatePitch()
        if(this.timer.sec == 5) {
            console.log("het is 5 lol");
        }
      
        for (const ship of this.bullets) {
            ship.update()

            for (const otherShip of this.bullets) {
                if(ship !== otherShip) {
                    if(ship.hasCollision(otherShip)) {
                        ship.hit = true
                        // break inner loop to prevent overwriting the hit
                        break
                    } 
                    else {
                        ship.hit = false
                    }
                }
            }
        }
        console.log(this.isPaused)
        if(!this.isPaused) {
            requestAnimationFrame(() => this.gameLoop())
        }
    }





 

}

window.addEventListener("load", () => new Main())

