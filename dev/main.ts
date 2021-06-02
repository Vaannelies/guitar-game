/// <reference path="messageboard.ts"/>
// / <reference path="pitchdetect.ts"/>

// import PitchDetect from "./pitchdetect";
// import * as data from '../docs/notes/perfect.json'

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
    private notes: {title: string, time: string}[]
    private bar: Bar
    private pitchdetect: PitchDetect 



// public stopwatch: any;



    constructor() {
        // this.stopwatch = new Stopwatch();
        // this.stopwatch.start();
        // console.log(this.stopwatch.getTime())
        // this.stopwatch.stop();
        this.timer = new Timer();
        this.pitchdetect = new PitchDetect();
        // console.log(pitchdetect)
        // this.pitchdetect.updatePitch()

        this.bar = new Bar();
        // console.log(this.bar)


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
            if(this.isPaused) {
                this.audioPlayer.pause();
                this.timer.stopTimer();
            } else {
                this.audioPlayer.play();
                this.gameLoop();
                this.timer.startTimer();
            }
            // console.log('paused:', this.isPaused)
        })
    }

    async start() {
        await this.fetchNotesForSong();
        // console.log("notes", this.notes)


        this.timer.startTimer();
        this.audioPlayer = new AudioPlayer();
        this.audioPlayer.play();
        // for (let i = 0; i < 10; i++) {
        //     this.bullets.push(new Bullet())
        // }
   
        // Eventueel Messageboard aanmaken zodat deze zichtbaar wordt?
        this.messageboard = Messageboard.getInstance()
        // console.log(this.messageboard)

        // pitchdetect.toggleLiveInput();

        
        // this.notes.forEach(note => {
        //     // console.log('time', note.time.toString())
        //     // console.log('timer time', (this.timer.sec+"."+this.timer.ms).toString())
        //     // console.log(this.timer.sec+4)
        //     let newSec;
        //     let hallo;
        //     if(this.timer.sec < 10) {
        //         // console.log(this.timer.sec)
        //        newSec =  note.time.substring(1)
        //     //    console.log(newSec)
        //        let hoi = parseInt(newSec,10)
        //        hoi -= 4;
        //        if(hoi < 10) {
        //            note.time = 0 +  hoi.toString() + ".00"
        //        } else {
        //            note.time = hoi.toString() + ".00"
        //        }
        //     } else {
        //         note.time = (parseInt(note.time, 10) - 4 ).toString() + ".00"
        //     }
        // })
        this.gameLoop()
    }
    
    async fetchNotesForSong() {
        await fetch("notes/perfect.json")
            .then(response => response.json())
            .then(json => {this.notes = json.notes });
    }

    checkDelay() {
        if((this.timer.sec + this.timer.ms/100) - (this.audioPlayer.audio.currentTime %60) <= -1) {
            const delay = (this.timer.sec + this.timer.ms/100) - (this.audioPlayer.audio.currentTime%60);
            console.log('delay:', delay);
            this.timer.sec = Math.round(this.audioPlayer.audio.currentTime%60);
            
            for (const ship of this.bullets) {
                ship._position.y = ship._position.y + ship.speed * delay * 100
            }    
        }
    }
    gameLoop() {
        console.log(this.audioPlayer.audio.currentTime)
        // this.pitchdetect.updatePitch()
        // check for delay
        this.checkDelay()
    
        if(this.timer.sec == 5) {
            // console.log("het is 5 lol");
        }

        

        this.notes.forEach(note => {
                // console.log('time', note.time.toString())
                // console.log('timer time', (this.timer.sec+"."+this.timer.ms).toString())
                // console.log(this.timer.sec+4)
                let newSec;
                let hallo;
                if(this.timer.sec < 10) {
                    // console.log(this.timer.sec)
                   newSec =  this.timer.sec.substring(1)
                //    console.log(newSec)
                   let hoi = parseInt(newSec,10)
                   hoi += 4;
                   if(hoi < 10) {
                       hallo = 0 +  hoi.toString() 
                   } else {
                       hallo = hoi.toString()
                   }
                } else {
                    hallo = this.timer.sec + 4
                }

                // console.log(hallo)
                // console.log(note.time)
            if(note.time.toString() == (hallo+"."+this.timer.ms).toString()) {
                console.log(note.title);
                this.bullets.push(new Bullet(note.title))
            }
        })
      
        // G# D# F G# C A# C A# G# C A# C C C G# G# G# G# A# C A# G G# G C A# G# C A# G# D# C A# G# G#
        for (const ship of this.bullets) {
            ship.update()

            for (const otherShip of this.bullets) {
                if(ship !== otherShip) {
                    if(ship.hasCollision(this.bar)) {
                        if(!this.pitchdetect.active) {
                            this.pitchdetect.activate()
                        } else {

                            ship.hit = true
                            ship.style.backgroundColor = "#e2eaff";
                            // console.log(ship.note, this.timer.sec, ":", this.timer.ms)
                            // break inner loop to prevent overwriting the hit
                            // console.log('collision', this.pitchdetect.noteStrings[this.pitchdetect.note%12], ship.note)
                            if(this.pitchdetect.noteStrings[this.pitchdetect.note%12] === ship.note) {
                                ship.style.backgroundColor = "#00ee00";
                                ship.style.boxShadow = "0 0 30px 1px #00ee00";
                            }
                            break
                        }
                    }
                    else {
                        ship.hit = false
                        this.pitchdetect.active = false
                    }
                }
            }
        }
        if(!this.isPaused) {
            requestAnimationFrame(() => this.gameLoop())
        }
    }






 

}

window.addEventListener("load", () => new Main())

