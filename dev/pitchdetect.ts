
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

        // Connect it to the destination.
        this.analyser = this.audioContext?.createAnalyser();
        this.analyser.fftSize = 2048;
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

    public noteToOutputNote(note: any, octave: any) {
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

        buf = buf.slice(r1,r2);
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

    public updatePitch() {
        // let cycles: any = new Array;
        if(this.active && this.activeTime < 10) {
            if(this.analyser) {
                this.analyser.getFloatTimeDomainData( this.buf );
            }
            let ac: any = this.autoCorrelate(this.buf, this.audioContext?.sampleRate );
            if (ac == -1) {
                this.note = null;
            } else {
                this.pitch = ac;
                this.note = this.noteFromPitch( this.pitch );
                this.octave = this.octaveFromNote(this.note)
                this.outputNote = this.noteToOutputNote(this.note, this.octave)
                this.detune= this.centsOffFromPitch( this.pitch, this.note );
            }
            this.activeTime++
            setTimeout(() => {this.updatePitch()}, 19);
        }
    }
}

window.customElements.define("pitchdetect-component", (PitchDetect as any))
