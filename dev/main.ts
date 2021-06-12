/// <reference path="timer.ts"/>
/// <reference path="pitchdetect.ts"/>

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
    public points: number;
    private scoreboard: Scoreboard;
    private pauseButton: HTMLElement
    private pauseMenu: PauseMenu
    private menuContainer: HTMLElement
    private songTitle: HTMLElement
    private instructions: Instructions
    private credits: Credits
    private finish: Finish


   private constructor() {
        this.menuContainer = document.createElement("div");
        this.menuContainer.setAttribute('id', 'menu-container');
        document.body?.appendChild(this.menuContainer);
        this.createMenu();
        this.pitchdetect = new PitchDetect();
        this.audioPlayer = new AudioPlayer();
        this.points = 0;
        this.songTitle = document.createElement('div')
        this.songTitle.setAttribute('class', 'song-title');
        this.songTitle.innerHTML = "<h1 class='song-title --title'>Perfect</h1><p class='song-title --artist'>Ed Sheeran</p>";
        document.body.appendChild(this.songTitle)
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

        const instructionsButton = document.createElement("button");
        instructionsButton.setAttribute('class', 'button --instructions')
        instructionsButton.innerText = "HOW TO PLAY?";

        const creditsButton = document.createElement("button");
        creditsButton.setAttribute('class', 'button --credits')
        creditsButton.innerText = "CREDITS";

        this.menuContainer.appendChild(menu)
        menu.appendChild(title)
        menu.appendChild(button)
        menu.appendChild(instructionsButton)
        menu.appendChild(creditsButton)
        button.addEventListener('click', () => {
            menu.remove();
            this.start();
        })
        instructionsButton.addEventListener('click', () => {
            menu.remove();
            this.showInstructions();
        })
        creditsButton.addEventListener('click', () => {
            menu.remove();
            this.showCredits();
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
        this.songTitle.style.opacity = "100%";
        (this.songTitle.children[0]  as HTMLElement).style.opacity= "100%";
        (this.songTitle.children[1]  as HTMLElement).style.opacity= "100%";
        setTimeout(() => {
            this.songTitle.style.opacity = "0%";
            (this.songTitle.children[0]  as HTMLElement).style.opacity = "0%";
            (this.songTitle.children[1]  as HTMLElement).style.opacity = "0%";
        }, 2000);
        this.gameLoop()
    }
    showInstructions() {
        this.instructions = new Instructions()
    }

    showCredits() {
        this.credits = new Credits()
    }
    
    showFinish() {
        this.audioPlayer.fadeOut()
        this.finish = new Finish()
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

    gameLoop() {
        for (const bullet of this.bullets) {
            for (const otherBullet of this.bullets) {
                if(bullet !== otherBullet) {
                    if(bullet.hasCollision(this.bar)) {
                        if(this.notes[this.notes.length-1].time === bullet.time) {
                            setTimeout(() => {
                                console.log(this.notes[this.notes.length-1].time, bullet.time)
                                this.showFinish()
                            }, 2000);
                        } 
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

