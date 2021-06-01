// ///<reference path="messageboard.ts" />
// class Captain extends HTMLElement{
    
//     private ship : GameObject

//     constructor(ship : GameObject) {
//         super()

//         this.ship = ship

//         let game = document.getElementsByTagName("game")[0]
//         game.appendChild(this)
//     }

//     public update() {
//         let x = this.ship.position.x + this.ship.clientWidth / 2
//         let y = this.ship.position.y 
//         this.style.transform = `translate(${x}px, ${y}px) rotate(${0}deg)`
//     }

//     public onCollision(numberOfHits : number) {
//         if(numberOfHits == 1)  { 
//             this.style.backgroundImage = `url(images/emote_alert.png)`
//             console.log(`Captain of ${this.ship.color} pirateship WOKE UP!`) 
//             Messageboard.getInstance().addMessage(`Captain of ${this.ship.color} pirateship WOKE UP!`)
//         }
//         else if(numberOfHits == 7) {
//             this.style.backgroundImage = `url(images/emote_faceAngry.png)`
//             console.log(`Captain of ${this.ship.color} pirateship got ANGRY!`)
//             Messageboard.getInstance().addMessage(`Captain of ${this.ship.color} pirateship got ANGRY!`)
//         }
//     }
// }

// window.customElements.define("captain-component", Captain as any)