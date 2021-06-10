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
    private static instance: Main
    private points: number;
    private scoreboard: Scoreboard;
    private pauseButton: HTMLElement
    private pauseMenu: PauseMenu
    private menuContainer: HTMLElement


   private constructor() {
        this.menuContainer = document.createElement("div");
        this.menuContainer.setAttribute('id', 'menu-container');
        document.body?.appendChild(this.menuContainer);
        this.createMenu();
        this.pitchdetect = new PitchDetect();
        this.audioPlayer = new AudioPlayer();
        this.points = 0;
        this.bar = new Bar();
    }

    public static getInstance(): Main {
        if(!Main.instance) {
            Main.instance = new Main();
        }
        return this.instance;
    }

    createMenu() {
        const menu = document.createElement("div");
        menu.setAttribute('id', 'menu');
        const title = document.createElement("h1");
        title.setAttribute('class', 'title');
        title.innerText = 'Are you ready?'
        const button = document.createElement("button");
        button.setAttribute('class', 'button --start')
        button.innerText = "START";

        this.menuContainer.appendChild(menu)
        menu.appendChild(title)
        menu.appendChild(button)
        button.addEventListener('click', () => {
            menu.remove();
            this.start();
        })
        
    }
    
    async start() {
        await this.fetchNotesForSong();
        this.timer = new Timer();
        this.timer.startTimer();
        this.audioPlayer.play();
        this.scoreboard = new Scoreboard()
        this.scoreboard.setScore(0)

        this.pauseButton = document.createElement("button");
        this.pauseButton.innerText = "PAUSE";
        this.pauseButton.setAttribute('class', 'button --pause')
        this.menuContainer.appendChild(this.pauseButton)
        this.pauseButton.addEventListener('click', ()=>{this.pauseGame()})

        this.notes.forEach(note => {
            this.bullets.push(new Bullet(note.title, note.time))
        })
        this.gameLoop()
    }

    pauseGame() {
        this.isPaused = !this.isPaused
        if(this.isPaused) {
            this.audioPlayer.pause();
            this.timer.stopTimer();
            this.pauseMenu = new PauseMenu()
        } else {
            this.audioPlayer.play();
            this.gameLoop();
            this.timer.startTimer();
            this.pauseMenu.remove();
        }
    }

    stopGame() {
        console.log('hoi')
        this.points = 0;
        this.isPaused = false;
        this.bullets.forEach(bullet => {
            bullet.remove();
        })
        this.scoreboard.remove()
        this.pauseButton.remove()
        this.timer.remove()
        this.bullets = []
        this.notes = []
        this.audioPlayer.stop()
        this.createMenu()
    }
    
    async fetchNotesForSong() {
        await fetch("notes/perfect.json")
            .then(response => response.json())
            .then(json => {this.notes = json.notes });
    }

    // checkDelay() {
    //     this.delay = (this.timer.sec + this.timer.ms/100) - (this.audioPlayer.audio.currentTime%60);
    //     if(this.delay <= -0.4 || this.delay>= 0.4) {
    //         this.timer.sec = Math.round(this.audioPlayer.audio.currentTime%60);
    //         this.timer.ms = this.audioPlayer.audio.currentTime.toString().split(".")[1].substring(0,2);
    //     }
    // }

    // fixCurrentPositions() {
    //     for (const bullet of this.bullets) {
    //         bullet._position.y = bullet.clientHeight + bullet.speed * (this.timer.sec - parseInt(bullet.time.sec))
    //     }  
    // }
    
    // spawnLateBullets() {

    //     for (const note of this.notes) {
    //         if((this.timer.sec - this.delay) > (parseInt(note.time.sec) - 4) && (this.timer.sec - this.delay) < (parseInt(note.time.sec))) {
    //             if((this.bullets.filter(bullet => bullet.time === note.time)).length < 1) {
    //                 const newBullet = new Bullet(note.title, note.time)
    //                 this.bullets.push(newBullet)
    //                 newBullet._position.y = newBullet.speed * this.delay * 100
    //             }
    //         }
    //     }  
    // }

    gameLoop() {
        // console.log(this.points)
        // this.checkDelay()
        for (const bullet of this.bullets) {
            for (const otherBullet of this.bullets) {
                if(bullet !== otherBullet) {
                    if(bullet.hasCollision(this.bar)) {
                        if(!this.pitchdetect.active) {
                            this.pitchdetect.activate()
                        } else {
                            if(!bullet.pointWasGiven) {
                                bullet.style.backgroundColor = "#e2eaff";
                                if(bullet._position.y >= (document.getElementById('bar').getBoundingClientRect().top + (document.getElementById('bar').getBoundingClientRect().height / 4))) {
                                    if(this.pitchdetect.note !== null) {
                                        if(this.pitchdetect.outputNote === bullet.note) {
                                            bullet.style.backgroundColor = "#00ee00";
                                            bullet.style.boxShadow = "0 0 30px 1px #00ee00";
                                            this.points++;
                                        } else {
                                            bullet.style.backgroundColor = "red";
                                            bullet.style.boxShadow = "0 0 30px 1px red";
                                            this.points--;
                                        }                                        
                                        break
                                    } else { 
                                        bullet.style.backgroundColor = "#222222";
                                        bullet.style.boxShadow = "0 0 0 0";
                                        this.points -= 1;
                                    }
                                    this.scoreboard.setScore(this.points)
                                    bullet.pointWasGiven = true;
                                }
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

