/// <reference path="messageboard.ts"/>
// / <reference path="pitchdetect.ts"/>

// import PitchDetect from "./pitchdetect";

// import { Stopwatch } from "ts-stopwatch";
// import PitchDetect from './pitchdetect';
// const Stopwatch = require("ts-stopwatch").Stopwatch;

// const Stopwatch = require("ts-stopwatch").Stopwatch;

class Main {
    // const Stopwatch = requestAnimationFrame()

    private bullets : Bullet[] = []
    private messageboard : Messageboard



// public stopwatch: any;



    constructor() {
        // this.stopwatch = new Stopwatch();
        // this.stopwatch.start();
        // console.log(this.stopwatch.getTime())
        // this.stopwatch.stop();
    
    
        for (let i = 0; i < 10; i++) {
            this.bullets.push(new Bullet())
        }
   
        // Eventueel Messageboard aanmaken zodat deze zichtbaar wordt?
        this.messageboard = Messageboard.getInstance()
        console.log(this.messageboard)

        // pitchdetect.toggleLiveInput();
        const pitchdetect: PitchDetect = new PitchDetect();
        console.log(pitchdetect)
        pitchdetect.updatePitch()
        this.gameLoop()
        
    }
    
    gameLoop() {
        console.log("yo")
        // pitchdetect.updatePitch()
      
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

        requestAnimationFrame(() => this.gameLoop())
    }





 

}

window.addEventListener("load", () => new Main())

