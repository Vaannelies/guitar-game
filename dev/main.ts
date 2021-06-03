class Main {
    // const Stopwatch = requestAnimationFrame()
    public  audioPlayer: AudioPlayer
    private bullets : Bullet[] = []
    private timer: Timer
    private isPaused: boolean = false
    private notes: {title: string, time:  {min: string, sec: string, ms: string}}[]
    private bar: Bar
    private pitchdetect: PitchDetect 
    private delay: number
    private delayMonitor: HTMLElement
    private static instance: Main


   private constructor() {
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
        })

        this.delayMonitor = document.createElement("h1");
        this.delayMonitor.setAttribute('style', 'z-index: 1; color: white; position: absolute; top: 0;')
        menuContainer.appendChild(this.delayMonitor)
    }

    async start() {
        await this.fetchNotesForSong();
      
        this.timer.startTimer();
        this.audioPlayer.play();
  
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
        this.delayMonitor.innerHTML = this.audioPlayer.audio.currentTime.toString();
        if(this.delay <= -0.4 || this.delay>= 0.4) {
            this.timer.sec = Math.round(this.audioPlayer.audio.currentTime%60);
            this.timer.ms = this.audioPlayer.audio.currentTime.toString().split(".")[1].substring(0,2);
        }
    }

    fixCurrentPositions() {
        for (const bullet of this.bullets) {
            bullet._position.y = bullet.clientHeight + bullet.speed * (this.timer.sec - parseInt(bullet.time.sec))
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

    
       for (const bullet of this.bullets) {

            for (const otherBullet of this.bullets) {
                if(bullet !== otherBullet) {
                    if(bullet.hasCollision(this.bar)) {
                        if(!this.pitchdetect.active) {
                            this.pitchdetect.activate()
                        } else {
                            bullet.style.backgroundColor = "#e2eaff";
                            // console.log(bullet.note, this.timer.sec, ":", this.timer.ms)
                            // break inner loop to prevent overwriting the hit
                            console.log(this.pitchdetect.note)
                            // console.log('collision', this.pitchdetect.noteStrings[this.pitchdetect.note%12], bullet.note)
                            if(this.pitchdetect.note !== null) {
                            // if(this.pitchdetect.noteStrings.indexOf(this.pitchdetect.note%12)) {
                                if(this.pitchdetect.noteStrings[this.pitchdetect.note%12] === bullet.note) {
                                    bullet.style.backgroundColor = "#00ee00";
                                    bullet.style.boxShadow = "0 0 30px 1px #00ee00";
                                }
                                else if(this.pitchdetect.noteStrings[this.pitchdetect.note%12] !== bullet.note) {
                                    bullet.style.backgroundColor = "red";
                                    bullet.style.boxShadow = "0 0 30px 1px red";
                                }
                                break
                            } else {
                                bullet.style.backgroundColor = "#222222";
                                bullet.style.boxShadow = "0 0 0 0";
                            }
                        }
                    }
                    else {
                        bullet.style.boxShadow = "0 0 30px 1px #3c00ff";
                        bullet.style.backgroundColor = "white";
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

window.addEventListener("load", () => Main.getInstance())

