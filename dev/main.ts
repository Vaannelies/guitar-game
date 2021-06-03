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
    public  audioPlayer: AudioPlayer
    private bullets : Bullet[] = []
    private messageboard : Messageboard
    private timer: Timer
    private isPaused: boolean = false
    private notes: {title: string, time:  {min: string, sec: string, ms: string}}[]
    private bar: Bar
    private pitchdetect: PitchDetect 
    private delay: number
    private delayMonitor: HTMLElement
    private static instance: Main


// public stopwatch: any;



   private constructor() {
        // this.stopwatch = new Stopwatch();
        // this.stopwatch.start();
        // console.log(this.stopwatch.getTime())
        // this.stopwatch.stop();
        Main.instance = this;
        this.createMenu();
        this.timer = new Timer();
        this.pitchdetect = new PitchDetect();
        this.audioPlayer = new AudioPlayer();
        // console.log(pitchdetect)
        // this.pitchdetect.updatePitch()

        this.bar = new Bar();
        // console.log(this.bar)


        
    
    }

    public static getInstance(): Main {
        if(!Main.instance) {
            console.log('new main')
            Main.instance = new Main();
        }
        return this.instance;
    }

    createMenu() {
        
        const body = document.querySelector('body');
        const menuContainer = document.createElement("div");
        menuContainer.setAttribute('id', 'menu-container');
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

        this.delayMonitor = document.createElement("h1");
        this.delayMonitor.setAttribute('style', 'z-index: 1; color: white; position: absolute; top: 0;')
        menuContainer.appendChild(this.delayMonitor)
    }

    async start() {
        await this.fetchNotesForSong();
        // console.log("notes", this.notes)


        this.timer.startTimer();
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
        this.notes.forEach(note => {
            this.bullets.push(new Bullet(note.title, note.time))
        })
        this.gameLoop()
    }
    
    async fetchNotesForSong() {
        await fetch("notes/perfect.json")
            .then(response => response.json())
            .then(json => {this.notes = json.notes });
    }

    checkDelay() {
        this.delay = (this.timer.sec + this.timer.ms/100) - (this.audioPlayer.audio.currentTime%60);
        // console.log('delay:', delay);
        // console.log("timer sec", this.timer.sec, "currentimesec", this.audioPlayer.audio.currentTime%60 )
        this.delayMonitor.innerHTML = this.audioPlayer.audio.currentTime.toString();
        if(this.delay <= -0.4 || this.delay>= 0.4) {
            this.timer.sec = Math.round(this.audioPlayer.audio.currentTime%60);
            this.timer.ms = this.audioPlayer.audio.currentTime.toString().split(".")[1].substring(0,2);
            // console.log("fixed delay")
            // this.fixCurrentPositions()
            // this.spawnLateBullets()
        }
    }

    fixCurrentPositions() {
        for (const ship of this.bullets) {
            // ship._position.y = ship._position.y + ship.speed * (this.timer.sec - parseInt(ship.time.sec))
            ship._position.y = ship.clientHeight + ship.speed * (this.timer.sec - parseInt(ship.time.sec))
            // ship._position.y = ship._position.y + ship.speed * this.delay * 100
        }  
    }
    
    spawnLateBullets() {

        for (const note of this.notes) {
            // console.log('note times', parseInt(note.time.sec))
            if((this.timer.sec - this.delay) > (parseInt(note.time.sec) - 4) && (this.timer.sec - this.delay) < (parseInt(note.time.sec))) {
                if((this.bullets.filter(bullet => bullet.time === note.time)).length < 1) {
                    const newBullet = new Bullet(note.title, note.time)
                    this.bullets.push(newBullet)
                    newBullet._position.y = newBullet.speed * this.delay * 100
                }
            }
         
        }  
    }

    gameLoop() {
        // console.log(this.audioPlayer.audio.currentTime)
        // this.pitchdetect.updatePitch()
        // check for delay
        this.checkDelay()
    
        if(this.timer.sec == 5) {
            // console.log("het is 5 lol");
        }

        

        // this.notes.forEach(note => {
        //         // console.log('time', note.time.toString())
        //         // console.log('timer time', (this.timer.sec+"."+this.timer.ms).toString())
        //         // console.log(this.timer.sec+4)
        //         let newSec;
        //         let hallo;
        //         if(this.timer.sec < 10) {
        //             // console.log(this.timer.sec)
        //            newSec =  this.timer.sec
        //         //    console.log('newsec', newSec)
        //         //    console.log(newSec)
        //         //    let hoi = parseInt(newSec)
        //         let hoi = newSec
        //            hoi += 4;
        //            if(hoi < 10) {
        //                hallo = 0 +  hoi.toString() 
        //            } else {
        //                hallo = hoi.toString()
        //            }
        //         } else {
        //             hallo = this.timer.sec + 4
        //         }

        //         // console.log(hallo)
        //         // console.log(note.time)
        //     if(note.time.sec == hallo.toString() && note.time.min === this.timer.min.toString()) {
        //     // if(note.time.sec == hallo.toString() && note.time.min === this.timer.min.toString() && note.time.ms == this.timer.ms.toString()) {
        //         console.log(note.title);
        //         if((this.bullets.filter(bullet => bullet.time === note.time)).length < 1) {
        //             this.bullets.push(new Bullet(note.title, note.time))
        //         }
        //     }
        // })
      
        // G# D# F G# C A# C A# G# C A# C C C G# G# G# G# A# C A# G G# G C A# G# C A# G# D# C A# G# G#
        for (const ship of this.bullets) {
            // ship.update()
            // ship._position.y = ship.clientHeight + ship.speed * 1 * parseInt((this.audioPlayer.audio.currentTime.toString().split(".")[1]).substring(0,2))

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
                            console.log(this.pitchdetect.note)
                            // console.log('collision', this.pitchdetect.noteStrings[this.pitchdetect.note%12], ship.note)
                            if(this.pitchdetect.note !== null) {
                            // if(this.pitchdetect.noteStrings.indexOf(this.pitchdetect.note%12)) {
                                if(this.pitchdetect.noteStrings[this.pitchdetect.note%12] === ship.note) {
                                    ship.style.backgroundColor = "#00ee00";
                                    ship.style.boxShadow = "0 0 30px 1px #00ee00";
                                }
                                else if(this.pitchdetect.noteStrings[this.pitchdetect.note%12] !== ship.note) {
                                    ship.style.backgroundColor = "red";
                                    ship.style.boxShadow = "0 0 30px 1px red";
                                }
                                break
                            }
                        }
                    }
                    else {
                        ship.style.boxShadow = "0 0 30px 1px #3c00ff";
                        ship.style.backgroundColor = "white";
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

