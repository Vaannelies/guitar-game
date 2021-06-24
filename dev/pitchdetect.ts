
// thanks to https://github.com/cwilso/pitchdetect
class PitchDetect extends  HTMLElement {
    public audioContext: AudioContext | null = null;
    public isPlaying: boolean = false;
    public sourceNode: any = null;
    public analyser: any = null;
    public theBuffer: any = null;
    public DEBUGCANVAS: any = null; 
    public mediaStreamSource: any = null;
    public detectorElem: any; 
    public canvasElem: any;
    public waveCanvas: any;
    public pitchElem: any;
    public noteElem: any;
    public detuneElem: any;
    public detuneAmount: any;
    public pitch: any;
    public note: any;
    public outputNote: any;
    public octave: any;
    public detune: any;

    public active: boolean;
    private activeTime: number = 0;

//    private mediaElement:any= null

    constructor() {
        super();
        window.AudioContext = window.AudioContext;

        this.audioContext = new AudioContext();
        this.active = false;
        this.updatePitch();
     
        this.toggleLiveInput();

    }

    public activate() {
        this.activeTime = 0;
        this.active = true;
        this.updatePitch();
    }

    public error() {
        alert('Stream generation failed.');
    }

    public async getUserMedia(dictionary: any) {
        try {
            navigator.mediaDevices.getUserMedia = 
                navigator?.mediaDevices.getUserMedia ||
                navigator?.mediaDevices.webkitGetUserMedia ||
                navigator?.mediaDevices.mozGetUserMedia;
         
            await navigator.mediaDevices.getUserMedia(dictionary)
                .then((res) => { 
                    this.gotStream(res)
                });
        } catch (e) {
            alert('getUserMedia threw exception :' + e);
        }
    }

    public gotStream(stream: any) {
        // Create an AudioNode from the stream.
        this.mediaStreamSource = this.audioContext?.createMediaStreamSource(stream);
        // if(this.audioContext) {
            // this.mediaElement =  this.audioContext?.createMediaElementSource(stream);
        // }

        // Connect it to the destination.
        this.analyser = this.audioContext?.createAnalyser();
        this.analyser.fftSize = 4096;
        this.mediaStreamSource.connect(this.analyser );
        this.updatePitch();
    }

    public async toggleLiveInput() {
        if (this.isPlaying) {
            //stop playing and return
            this.sourceNode.stop( 0 );
            this.sourceNode = null;
            this.analyser = null;
            this.isPlaying = false;
        }
        this.getUserMedia({
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        });
    }


    public rafID: any = null;
    public tracks : any = null;
    public buflen: any = 2048;
    public buf: any = new Float32Array( this.buflen );

    public noteStrings: any = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    public noteToOutputNote(note: any) {
        const noteString = this.noteStrings[note%12]
        if(this.noteStrings[note%12].indexOf("#") !== -1) {
            return noteString + this.octave
        } else {
            return noteString.substring(0,1) + this.octave + noteString.substring(1, 2)
        }
    }
    public octaveFromNote(note: any) {
        return (note - note%12) / 12 - 1 
    }
    public noteFromPitch( frequency : any) {
        var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
        return Math.round( noteNum ) + 69;
    }

    public frequencyFromNoteNumber( note: any ) {
        return 440 * Math.pow(2,(note-69)/12);
    }

    public  centsOffFromPitch(frequency: any, note: any ) {
        return Math.floor( 1200 * Math.log( frequency / this.frequencyFromNoteNumber( note ))/Math.log(2) );
    }

    public autoCorrelate( buf: any, sampleRate: any ) {
        // Implements the ACF2+ algorithm
        var SIZE = buf.length;
        var rms = 0;

        for (var i=0;i<SIZE;i++) {
            var val = buf[i];
            rms += val*val;
        }
        rms = Math.sqrt(rms/SIZE);
        if (rms<0.01) // not enough signal
            return -1;
        var r1=0, r2=SIZE-1, thres=0.2;
        for (var i=0; i<SIZE/2; i++)
            if (Math.abs(buf[i])<thres) { r1=i; break; }
        for (var i=1; i<SIZE/2; i++)
            if (Math.abs(buf[SIZE-i])<thres) { r2=SIZE-i; break; }

            console.log('buf', buf)
        buf = buf.slice(r1,r2);
        console.log('bufafterslice', buf)
        SIZE = buf.length;

        var c = new Array(SIZE).fill(0);
        for (var i=0; i<SIZE; i++)
            for (var j=0; j<SIZE-i; j++)
                c[i] = c[i] + buf[j]*buf[j+i];

        var d=0; while (c[d]>c[d+1]) d++;
        var maxval=-1, maxpos=-1;
        for (var i=d; i<SIZE; i++) {
            if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
            }
        }
        var T0 = maxpos;

        var x1=c[T0-1], x2=c[T0], x3=c[T0+1];
        let a = (x1 + x3 - 2*x2)/2;
        let b = (x3 - x1)/2;
        if (a) T0 = T0 - b/(2*a);

        return sampleRate/T0;
    }

    public autoCorrelateTwo( buf: any, sampleRate: any ) {
        // Implements the ACF2+ algorithm
        var SIZE = buf.length;
        var rms = 0;

        for (var i=0;i<SIZE;i++) {
            var val = buf[i];
            rms += val*val;
        }
        rms = Math.sqrt(rms/SIZE);
        if (rms<0.01) // not enough signal
            return -1;

        var r1=0, r2=SIZE-1, thres=0.2;
        for (var i=0; i<SIZE/2; i++)
            if (Math.abs(buf[i])<thres) { r1=i; break; }
        for (var i=1; i<SIZE/2; i++)
            if (Math.abs(buf[SIZE-i])<thres) { r2=SIZE-i; break; }

        buf = buf.slice(r1,r2);
        SIZE = buf.length;

        var c = new Array(SIZE).fill(0);
        for (var i=0; i<SIZE; i++)
            for (var j=0; j<SIZE-i; j++)
                c[i] = c[i] + buf[j]*buf[j+i];

        var d=0; while (c[d]>c[d+1]) d++;
        var maxval=[-1], maxpos=[-1];
        for (var i=d; i<SIZE; i++) {
            if (c[i] > maxval) {
                maxval.push(c[i]);
                // maxpos.push(i);
            }
        }
        maxval.sort();
        maxval = [maxval[maxval.length-1], maxval[maxval.length-2], maxval[maxval.length-3], maxval[maxval.length-4]]
        console.log('maxval',maxval)
        maxpos = [];
        console.log('buf', buf)
        maxval.forEach(val => {
            maxpos.push(buf.indexOf(val))
        })
        var returnValues: number[] = []
        maxpos.forEach(T0 => {
            // var T0 = maxpos;
    
            var x1=c[T0-1], x2=c[T0], x3=c[T0+1];
            let a = (x1 + x3 - 2*x2)/2;
            let b = (x3 - x1)/2;
            if (a) T0 = T0 - b/(2*a);
    
            returnValues.push(sampleRate/T0);

        })
        return returnValues
    }


    public updatePitch() {

    // let  audioCtx = new AudioContext();
    //   let  analyser = audioCtx.createAnalyser();
    //  let   source = audioCtx.createMediaElementSource(this.audioContext);
        // source.connect(analyser);
        // analyser.connect(audioCtx.destination);

        // let cycles: any = new Array;
        if(this.active && this.activeTime < 10) {
            if(this.analyser) {
                this.analyser.getFloatTimeDomainData( this.buf );
            }
            // console.log('ac', this.buf )
            let ac: any = this.autoCorrelate(this.buf, this.audioContext?.sampleRate );
            if (ac == -1) {
                this.note = null;
            } else {
                this.pitch = ac;
                console.log('pitch1', this.pitch)
                this.note = this.noteFromPitch( this.pitch );
                // console.log('note1', this.note)
                this.octave = this.octaveFromNote(this.note)
                this.outputNote = this.noteToOutputNote(this.note)
                // console.log("autoputnote1", this.outputNote)
                this.detune= this.centsOffFromPitch( this.pitch, this.note );
            }

            if(this.analyser) {  
                // this.analyser.fftSize = 128;
                let noteArray: string[] = []
      
              let frequencyData = new Float32Array(this.analyser.frequencyBinCount);
              this.analyser.getFloatTimeDomainData(frequencyData)

// let ac2: any = this.autoCorrelateTwo(this.buf, this.audioContext?.sampleRate)
// if(ac2 == -1) {
//     this.note = null
// } else {
//     this.pitch = ac2[0]

var SIZE = frequencyData.length;
var rms = 0;

for (var i=0;i<SIZE;i++) {
    var val = frequencyData[i];
    rms += val*val;
}
rms = Math.sqrt(rms/SIZE);
if (rms<0.01) // not enough signal
    return -1;
var r1=0, r2=SIZE-1, thres=0.2;
for (var i=0; i<SIZE/2; i++)
    if (Math.abs(frequencyData[i])<thres) { r1=i; break; }
for (var i=1; i<SIZE/2; i++)
    if (Math.abs(frequencyData[SIZE-i])<thres) { r2=SIZE-i; break; }

    // console.log('buf', buf)
frequencyData = frequencyData.slice(r1,r2);
// console.log('bufafterslice', buf)

// frequencyData.slice(0, frequencyData.length-1)
                  console.log('frequencydata', frequencyData )
                  var c = new Array(SIZE).fill(0);
                  for (var i=0; i<SIZE; i++)
                      for (var j=0; j<SIZE-i; j++)
                          c[i] = c[i] + frequencyData[j]*frequencyData[j+i];
          
                  var d=0; while (c[d]>c[d+1]) d++;
                  var maxval=-1, maxpos=-1;
                  for (var i=d; i<SIZE; i++) {
                      if (c[i] > maxval) {
                          maxval = c[i];
                          maxpos = i;
                      }
                  }
                  frequencyData.forEach(frequency => {
                      
                      if(frequency > 0.1) {

                   var T0 = frequencyData.indexOf(frequency);
                            var x1=c[T0-1], x2=c[T0], x3=c[T0+1];
                            let a = (x1 + x3 - 2*x2)/2;
                            let b = (x3 - x1)/2;
                            if (a) T0 = T0 - b/(2*a);
                    
                       
                        // let ac: any = this.autoCorrelate(this.buf, frequency );
                        // if (ac == -1) {
                            // this.note = null;
                        // } else {
                            console.log('value', frequencyData.indexOf(frequency), frequency)

                            if(this.audioContext) {

                                this.pitch =  this.audioContext.sampleRate/T0;
                            }
                            console.log('pitch2', this.pitch)
                            this.note = this.noteFromPitch( this.pitch);
                            // console.log('note', this.note)
                            this.octave = this.octaveFromNote(this.note)
                            this.outputNote = this.noteToOutputNote(this.note)
                            this.detune= this.centsOffFromPitch( this.pitch, this.note );

                            // console.log('frequency note', this.outputNote)
                            if(!(noteArray.indexOf(this.outputNote) >= 0)) {
                                noteArray.push(this.outputNote);
                            }
                        // }
                      

                      }
                  })

                  
            //     //   this.pitch = frequencyData.indexOf(frequency)
            //       console.log('pitch2', this.pitch)
            //       this.note = this.noteFromPitch( this.pitch );
            //       // console.log('note', this.note)
            //       this.octave = this.octaveFromNote(this.note)
            //       this.outputNote = this.noteToOutputNote(this.note)
            //       this.detune= this.centsOffFromPitch( this.pitch, this.note );

            //       // console.log('frequency note', this.outputNote)
            //       if(!(noteArray.indexOf(this.outputNote) >= 0)) {
            //           noteArray.push(this.outputNote);
            //       }
            //   // }
                  console.log('noteArray', noteArray)
                  if((noteArray.indexOf("D0") >= 0) && (noteArray.indexOf("F#0") >= 0) && (noteArray.indexOf("A0") >= 0)) {
                   console.log("D chord");
                // }
            }
              
            }

            // const audioCtx = new AudioContext();
// const analyser = audioCtx.createAnalyser();
// const source = this.mediaStreamSource

// source.connect(analyser);
// analyser.connect(audioCtx.destination);
this.analyser.fftSize = 32;
// let pieceofhtml = document.createElement('div')
// pieceofhtml.innerHTML = "<audio id='audio' src='2.mp3'></audio> <div id='bar'>  <div id='P10' class='p'></div>  <div id='P20' class='p'></div>  <div id='P30' class='p'></div>  <div id='P40' class='p'></div>    <div id='P50' class='p'></div> <div id='P60' class='p'></div>   <div id='P70' class='p'></div> <div id='P80' class='p'></div>  <div id='P90' class='p'></div></div>"
// document.body.appendChild(pieceofhtml)

let frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

this.renderFrame(frequencyData);

this.activeTime++
setTimeout(() => {this.updatePitch()}, 19);
}
}
 renderFrame(frequencyData: any) {
    this.analyser.getByteFrequencyData(frequencyData);
    console.log("0", (frequencyData[0] * 100) / 256);
    console.log("1", (frequencyData[1] * 100) / 256);
    console.log("2", (frequencyData[2] * 100) / 256);
    console.log("3", (frequencyData[3] * 100) / 256);
    console.log("4", (frequencyData[4] * 100) / 256);
    console.log("5", (frequencyData[5] * 100) / 256);
    console.log("6", (frequencyData[6] * 100) / 256);
    console.log("7", (frequencyData[7] * 100) / 256);
    console.log("8", (frequencyData[8] * 100) / 256);
    // (document.querySelector("#P10") as HTMLElement).style.height = ((frequencyData[0] * 100) / 256) + "%";
    // (document.querySelector("#P20") as HTMLElement).style.height = ((frequencyData[1] * 100) / 256) + "%";
    // (document.querySelector("#P30") as HTMLElement).style.height = ((frequencyData[2] * 100) / 256) + "%";
    // (document.querySelector("#P40") as HTMLElement).style.height = ((frequencyData[3] * 100) / 256) + "%";
    // (document.querySelector("#P50") as HTMLElement).style.height = ((frequencyData[4] * 100) / 256) + "%";
    // (document.querySelector("#P60") as HTMLElement).style.height = ((frequencyData[5] * 100) / 256) + "%";
    // (document.querySelector("#P70") as HTMLElement).style.height = ((frequencyData[6] * 100) / 256) + "%";
    // (document.querySelector("#P80") as HTMLElement).style.height = ((frequencyData[7] * 100) / 256) + "%";
    // (document.querySelector("#P90") as HTMLElement).style.height = ((frequencyData[8] * 100) / 256) + "%";
    console.log(frequencyData)
    requestAnimationFrame(this.renderFrame);
}

}

window.customElements.define("pitchdetect-component", (PitchDetect as any))
