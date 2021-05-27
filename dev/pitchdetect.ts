class PitchDetect extends  HTMLElement {
    public audioContext: AudioContext | null = null;
    public isPlaying: boolean = false;
    public sourceNode: any = null;
    public analyser: any = null;
    public theBuffer: any = null;
    public DEBUGCANVAS: any = null; 
    public mediaStreamSource: any = null;
    public detectorElem: any; 
    public	canvasElem: any;
    public	waveCanvas: any;
    public	pitchElem: any;
    public	noteElem: any;
    public	detuneElem: any;
    public	detuneAmount: any;

    constructor() {
        super();
        window.AudioContext = window.AudioContext;

        this.audioContext = new AudioContext();
        // let MAX_SIZE = Math.max(4,Math.floor(this.audioContext.sampleRate/5000));	// corresponds to a 5kHz signal
        var request = new XMLHttpRequest();
        request.open("GET",  "./audio/vocal1.ogg", true);
        request.responseType = "arraybuffer";
        request.onload = ()=> {
        this.audioContext?.decodeAudioData( request.response, (buffer: any) => { 
                this.theBuffer = buffer;
            } );
        }
        request.send();

        // stopwatch.stop()
    

        this.detectorElem = document.getElementById( "detector" );
        this.canvasElem = document.getElementById( "output" );
        this.DEBUGCANVAS = document.getElementById( "waveform" );
        if (this.DEBUGCANVAS) {
            this.waveCanvas = this.DEBUGCANVAS.getContext("2d");
            this.waveCanvas.strokeStyle = "black";
            this.waveCanvas.lineWidth = 1;
        }
        this.pitchElem = document.getElementById( "pitch" );
        this.noteElem = document.getElementById( "note" );
        this.detuneElem = document.getElementById( "detune" );
        this.detuneAmount = document.getElementById( "detune_amt" );

    this.detectorElem.ondragenter = () => { 
            this.classList.add("droptarget"); 
            return false; };
        this.detectorElem.ondragleave =  () => { this.classList.remove("droptarget"); return false; };
        this.detectorElem.ondrop =  (e:any) => {
            this.classList.remove("droptarget");
            e.preventDefault();
            this.theBuffer = null;

            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.audioContext?.decodeAudioData( event.target.result, (buffer: any) =>{
                    this.theBuffer = buffer;
                }, ()=>{alert("error loading!");} ); 

            };
            reader.onerror = () => {
                alert("Error: " + reader.error );
            };
            reader.readAsArrayBuffer(e.dataTransfer.files[0]);
            return false;
        };
        this.toggleLiveInput();
        console.log("liveinput)")
    }

        // -------------------

        /*
    The MIT License (MIT)

    Copyright (c) 2014 Chris Wilson

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */


    public error() {
        alert('Stream generation failed.');
    }

    public async getUserMedia(dictionary: any) {
        try {
            navigator.getUserMedia = 
                navigator.getUserMedia;
                // navigator?.webkitGetUserMedia ||
                // navigator?.mozGetUserMedia;
         
          await navigator.mediaDevices.getUserMedia(dictionary)
          .then((res) => { 
              console.log(res);
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

    public toggleOscillator() {
        if (this.isPlaying) {
            //stop playing and return
            this.sourceNode.stop( 0 );
            this.sourceNode = null;
            this.analyser = null;
            this.isPlaying = false;
            if (!window.cancelAnimationFrame)
                window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
            window.cancelAnimationFrame( this.rafID );
            return "play oscillator";
        }
        this.sourceNode = this.audioContext?.createOscillator();

        this.analyser = this.audioContext?.createAnalyser();
        this.analyser.fftSize = 2048;
        this.sourceNode.connect( this.analyser );
        this.analyser.connect( this.audioContext?.destination );
        this.sourceNode.start(0);
        this.isPlaying = true;
        this.updatePitch();

        return "stop";
    }

    public async toggleLiveInput() {
        console.log("toggle")
        if (this.isPlaying) {
            //stop playing and return
            this.sourceNode.stop( 0 );
            this.sourceNode = null;
            this.analyser = null;
            this.isPlaying = false;
            if (!window.cancelAnimationFrame)
                window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
            window.cancelAnimationFrame( this.rafID );
        }
        this.getUserMedia(
            {
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

    public togglePlayback() {
        if (this.isPlaying) {
            //stop playing and return
            this.sourceNode.stop( 0 );
            this.sourceNode = null;
            this.analyser = null;
            this.isPlaying = false;
            if (!window.cancelAnimationFrame)
                window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
            window.cancelAnimationFrame( this.rafID );
            return "start";
        }

        this.sourceNode = this.audioContext?.createBufferSource();
        this.sourceNode.buffer = this.theBuffer;
        this.sourceNode.loop = true;

        this.analyser = this.audioContext?.createAnalyser();
        this.analyser.fftSize = 2048;
        this.sourceNode.connect( this.analyser );
        this.analyser.connect( this.audioContext?.destination );
        this.sourceNode.start( 0 );
        this.isPlaying = true;
        this.updatePitch();

        return "stop";
    }

    public rafID: any = null;
    public tracks : any = null;
    public buflen: any = 2048;
    public buf: any = new Float32Array( this.buflen );

    public noteStrings: any = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

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

    // this is the previously used pitch detection algorithm.
    /*
    var MIN_SAMPLES = 0;  // will be initialized when AudioContext is created.
    var GOOD_ENOUGH_CORRELATION = 0.9; // this is the "bar" for how close a correlation needs to be

    function autoCorrelate( buf, sampleRate ) {
        var SIZE = buf.length;
        var MAX_SAMPLES = Math.floor(SIZE/2);
        var best_offset = -1;
        var best_correlation = 0;
        var rms = 0;
        var foundGoodCorrelation = false;
        var correlations = new Array(MAX_SAMPLES);

        for (var i=0;i<SIZE;i++) {
            var val = buf[i];
            rms += val*val;
        }
        rms = Math.sqrt(rms/SIZE);
        if (rms<0.01) // not enough signal
            return -1;

        var lastCorrelation=1;
        for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
            var correlation = 0;

            for (var i=0; i<MAX_SAMPLES; i++) {
                correlation += Math.abs((buf[i])-(buf[i+offset]));
            }
            correlation = 1 - (correlation/MAX_SAMPLES);
            correlations[offset] = correlation; // store it, for the tweaking we need to do below.
            if ((correlation>GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
                foundGoodCorrelation = true;
                if (correlation > best_correlation) {
                    best_correlation = correlation;
                    best_offset = offset;
                }
            } else if (foundGoodCorrelation) {
                // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
                // Now we need to tweak the offset - by interpolating between the values to the left and right of the
                // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
                // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
                // (anti-aliased) offset.

                // we know best_offset >=1, 
                // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
                // we can't drop into this clause until the following pass (else if).
                var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
                return sampleRate/(best_offset+(8*shift));
            }
            lastCorrelation = correlation;
        }
        if (best_correlation > 0.01) {
            // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
            return sampleRate/best_offset;
        }
        return -1;
    //	var best_frequency = sampleRate/best_offset;
    }
    */

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
        if(this.analyser) {

            this.analyser.getFloatTimeDomainData( this.buf );
        }
        let ac: any = this.autoCorrelate( this.buf, this.audioContext?.sampleRate );
        // TODO: Paint confidence meter on canvasElem here.

        if (this.DEBUGCANVAS) {  // This draws the current waveform, useful for debugging
            this.waveCanvas.clearRect(0,0,512,256);
            this.waveCanvas.strokeStyle = "red";
            this.waveCanvas.beginPath();
            this.waveCanvas.moveTo(0,0);
            this.waveCanvas.lineTo(0,256);
            this.waveCanvas.moveTo(128,0);
            this.waveCanvas.lineTo(128,256);
            this.waveCanvas.moveTo(256,0);
            this.waveCanvas.lineTo(256,256);
            this.waveCanvas.moveTo(384,0);
            this.waveCanvas.lineTo(384,256);
            this.waveCanvas.moveTo(512,0);
            this.waveCanvas.lineTo(512,256);
            this.waveCanvas.stroke();
            this.waveCanvas.strokeStyle = "black";
            this.waveCanvas.beginPath();
            this.waveCanvas.moveTo(0,this.buf[0]);
            for (var i=1;i<512;i++) {
                this.waveCanvas.lineTo(i,128+(this.buf[i]*128));
            }
            this.waveCanvas.stroke();
        }

        if (ac == -1) {
            this.detectorElem.className = "vague";
            this.pitchElem.innerText = "--";
            this.noteElem.innerText = "-";
            this.detuneElem.className = "";
            this.detuneAmount.innerText = "--";
        } else {
            this.detectorElem.className = "confident";
            let pitch: any = ac;
            this.pitchElem.innerText = Math.round( pitch ) ;
            let note: any = this.noteFromPitch( pitch );
            this.noteElem.innerHTML = this.noteStrings[note%12];
            let  detune: any = this.centsOffFromPitch( pitch, note );
            if (detune == 0 ) {
                this.detuneElem.className = "";
                this.detuneAmount.innerHTML = "--";
            } else {
                if (detune < 0)
                    this.detuneElem.className = "flat";
                else
                    this.detuneElem.className = "sharp";
                this.detuneAmount.innerHTML = Math.abs( detune );
            }
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        this.rafID = window.requestAnimationFrame(this.updatePitch.bind(this));
    }
}

window.customElements.define("pitchdetect-component", (PitchDetect as any))


// /*
// The MIT License (MIT)

// Copyright (c) 2014 Chris Wilson

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// */

// window.AudioContext = window.AudioContext || window?.webkitAudioContext;

// let audioContext: AudioContext | null = null;
// let isPlaying: boolean = false;
// let sourceNode: any = null;
// let analyser: any = null;
// let theBuffer: any = null;
// let DEBUGCANVAS: any = null;
// let mediaStreamSource: any = null;
// let detectorElem: any, 
// 	canvasElem: any,
// 	waveCanvas: any,
// 	pitchElem: any,
// 	noteElem: any,
// 	detuneElem: any,
// 	detuneAmount: any;

// window.onload = function() {
// 	audioContext = new AudioContext();
// 	MAX_SIZE = Math.max(4,Math.floor(audioContext.sampleRate/5000));	// corresponds to a 5kHz signal
// 	var request = new XMLHttpRequest();
// 	request.open("GET", "../sounds/whistling3.ogg", true);
// 	request.responseType = "arraybuffer";
// 	request.onload = function() {
// 	  audioContext?.decodeAudioData( request.response, function(buffer) { 
// 	    	theBuffer = buffer;
// 		} );
// 	}
// 	request.send();

// 	detectorElem = document.getElementById( "detector" );
// 	canvasElem = document.getElementById( "output" );
// 	DEBUGCANVAS = document.getElementById( "waveform" );
// 	if (DEBUGCANVAS) {
// 		waveCanvas = DEBUGCANVAS.getContext("2d");
// 		waveCanvas.strokeStyle = "black";
// 		waveCanvas.lineWidth = 1;
// 	}
// 	pitchElem = document.getElementById( "pitch" );
// 	noteElem = document.getElementById( "note" );
// 	detuneElem = document.getElementById( "detune" );
// 	detuneAmount = document.getElementById( "detune_amt" );

// 	detectorElem.ondragenter = function () { 
// 		this.classList.add("droptarget"); 
// 		return false; };
// 	detectorElem.ondragleave = function () { this.classList.remove("droptarget"); return false; };
// 	detectorElem.ondrop = function (e:any) {
//   		this.classList.remove("droptarget");
//   		e.preventDefault();
// 		theBuffer = null;

// 	  	var reader = new FileReader();
// 	  	reader.onload = function (event: any) {
// 	  		audioContext?.decodeAudioData( event.target.result, function(buffer) {
// 	    		theBuffer = buffer;
// 	  		}, function(){alert("error loading!");} ); 

// 	  	};
// 	  	reader.onerror = function (event: Event) {
// 	  		alert("Error: " + reader.error );
// 		};
// 	  	reader.readAsArrayBuffer(e.dataTransfer.files[0]);
// 	  	return false;
// 	};



// }

// function error() {
//     alert('Stream generation failed.');
// }

// function getUserMedia(dictionary: any, callback: any) {
//     try {
//         navigator.getUserMedia = 
//         	navigator.getUserMedia ||
//         	navigator?.webkitGetUserMedia ||
//         	navigator?.mozGetUserMedia;
//         navigator.getUserMedia(dictionary, callback, error);
//     } catch (e) {
//         alert('getUserMedia threw exception :' + e);
//     }
// }

// function gotStream(stream: any) {
//     // Create an AudioNode from the stream.
//     mediaStreamSource = audioContext?.createMediaStreamSource(stream);

//     // Connect it to the destination.
//     analyser = audioContext?.createAnalyser();
//     analyser.fftSize = 2048;
//     mediaStreamSource.connect( analyser );
//     updatePitch();
// }

// function toggleOscillator() {
//     if (isPlaying) {
//         //stop playing and return
//         sourceNode.stop( 0 );
//         sourceNode = null;
//         analyser = null;
//         isPlaying = false;
// 		if (!window.cancelAnimationFrame)
// 			window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
//         window.cancelAnimationFrame( rafID );
//         return "play oscillator";
//     }
//     sourceNode = audioContext?.createOscillator();

//     analyser = audioContext?.createAnalyser();
//     analyser.fftSize = 2048;
//     sourceNode.connect( analyser );
//     analyser.connect( audioContext?.destination );
//     sourceNode.start(0);
//     isPlaying = true;
//     updatePitch();

//     return "stop";
// }

// function toggleLiveInput() {
//     if (isPlaying) {
//         //stop playing and return
//         sourceNode.stop( 0 );
//         sourceNode = null;
//         analyser = null;
//         isPlaying = false;
// 		if (!window.cancelAnimationFrame)
// 			window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
//         window.cancelAnimationFrame( rafID );
//     }
//     getUserMedia(
//     	{
//             "audio": {
//                 "mandatory": {
//                     "googEchoCancellation": "false",
//                     "googAutoGainControl": "false",
//                     "googNoiseSuppression": "false",
//                     "googHighpassFilter": "false"
//                 },
//                 "optional": []
//             },
//         }, gotStream);
// }

// function togglePlayback() {
//     if (isPlaying) {
//         //stop playing and return
//         sourceNode.stop( 0 );
//         sourceNode = null;
//         analyser = null;
//         isPlaying = false;
// 		if (!window.cancelAnimationFrame)
// 			window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
//         window.cancelAnimationFrame( rafID );
//         return "start";
//     }

//     sourceNode = audioContext?.createBufferSource();
//     sourceNode.buffer = theBuffer;
//     sourceNode.loop = true;

//     analyser = audioContext?.createAnalyser();
//     analyser.fftSize = 2048;
//     sourceNode.connect( analyser );
//     analyser.connect( audioContext?.destination );
//     sourceNode.start( 0 );
//     isPlaying = true;
//     updatePitch();

//     return "stop";
// }

// let rafID: any = null;
// let tracks : any = null;
// let buflen: any = 2048;
// let buf: any = new Float32Array( buflen );

// let noteStrings: any = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// function noteFromPitch( frequency : any) {
// 	var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
// 	return Math.round( noteNum ) + 69;
// }

// function frequencyFromNoteNumber( note: any ) {
// 	return 440 * Math.pow(2,(note-69)/12);
// }

// function centsOffFromPitch( frequency: any, note: any ) {
// 	return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
// }

// // this is the previously used pitch detection algorithm.
// /*
// var MIN_SAMPLES = 0;  // will be initialized when AudioContext is created.
// var GOOD_ENOUGH_CORRELATION = 0.9; // this is the "bar" for how close a correlation needs to be

// function autoCorrelate( buf, sampleRate ) {
// 	var SIZE = buf.length;
// 	var MAX_SAMPLES = Math.floor(SIZE/2);
// 	var best_offset = -1;
// 	var best_correlation = 0;
// 	var rms = 0;
// 	var foundGoodCorrelation = false;
// 	var correlations = new Array(MAX_SAMPLES);

// 	for (var i=0;i<SIZE;i++) {
// 		var val = buf[i];
// 		rms += val*val;
// 	}
// 	rms = Math.sqrt(rms/SIZE);
// 	if (rms<0.01) // not enough signal
// 		return -1;

// 	var lastCorrelation=1;
// 	for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
// 		var correlation = 0;

// 		for (var i=0; i<MAX_SAMPLES; i++) {
// 			correlation += Math.abs((buf[i])-(buf[i+offset]));
// 		}
// 		correlation = 1 - (correlation/MAX_SAMPLES);
// 		correlations[offset] = correlation; // store it, for the tweaking we need to do below.
// 		if ((correlation>GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
// 			foundGoodCorrelation = true;
// 			if (correlation > best_correlation) {
// 				best_correlation = correlation;
// 				best_offset = offset;
// 			}
// 		} else if (foundGoodCorrelation) {
// 			// short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
// 			// Now we need to tweak the offset - by interpolating between the values to the left and right of the
// 			// best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
// 			// we need to do a curve fit on correlations[] around best_offset in order to better determine precise
// 			// (anti-aliased) offset.

// 			// we know best_offset >=1, 
// 			// since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
// 			// we can't drop into this clause until the following pass (else if).
// 			var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
// 			return sampleRate/(best_offset+(8*shift));
// 		}
// 		lastCorrelation = correlation;
// 	}
// 	if (best_correlation > 0.01) {
// 		// console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
// 		return sampleRate/best_offset;
// 	}
// 	return -1;
// //	var best_frequency = sampleRate/best_offset;
// }
// */

// function autoCorrelate( buf: any, sampleRate: any ) {
// 	// Implements the ACF2+ algorithm
// 	var SIZE = buf.length;
// 	var rms = 0;

// 	for (var i=0;i<SIZE;i++) {
// 		var val = buf[i];
// 		rms += val*val;
// 	}
// 	rms = Math.sqrt(rms/SIZE);
// 	if (rms<0.01) // not enough signal
// 		return -1;

// 	var r1=0, r2=SIZE-1, thres=0.2;
// 	for (var i=0; i<SIZE/2; i++)
// 		if (Math.abs(buf[i])<thres) { r1=i; break; }
// 	for (var i=1; i<SIZE/2; i++)
// 		if (Math.abs(buf[SIZE-i])<thres) { r2=SIZE-i; break; }

// 	buf = buf.slice(r1,r2);
// 	SIZE = buf.length;

// 	var c = new Array(SIZE).fill(0);
// 	for (var i=0; i<SIZE; i++)
// 		for (var j=0; j<SIZE-i; j++)
// 			c[i] = c[i] + buf[j]*buf[j+i];

// 	var d=0; while (c[d]>c[d+1]) d++;
// 	var maxval=-1, maxpos=-1;
// 	for (var i=d; i<SIZE; i++) {
// 		if (c[i] > maxval) {
// 			maxval = c[i];
// 			maxpos = i;
// 		}
// 	}
// 	var T0 = maxpos;

// 	var x1=c[T0-1], x2=c[T0], x3=c[T0+1];
// 	let a = (x1 + x3 - 2*x2)/2;
// 	let b = (x3 - x1)/2;
// 	if (a) T0 = T0 - b/(2*a);

// 	return sampleRate/T0;
// }

// function updatePitch() {
// 	let cycles: any = new Array;
// 	analyser.getFloatTimeDomainData( buf );
// 	let ac: any = autoCorrelate( buf, audioContext?.sampleRate );
// 	// TODO: Paint confidence meter on canvasElem here.

// 	if (DEBUGCANVAS) {  // This draws the current waveform, useful for debugging
// 		waveCanvas.clearRect(0,0,512,256);
// 		waveCanvas.strokeStyle = "red";
// 		waveCanvas.beginPath();
// 		waveCanvas.moveTo(0,0);
// 		waveCanvas.lineTo(0,256);
// 		waveCanvas.moveTo(128,0);
// 		waveCanvas.lineTo(128,256);
// 		waveCanvas.moveTo(256,0);
// 		waveCanvas.lineTo(256,256);
// 		waveCanvas.moveTo(384,0);
// 		waveCanvas.lineTo(384,256);
// 		waveCanvas.moveTo(512,0);
// 		waveCanvas.lineTo(512,256);
// 		waveCanvas.stroke();
// 		waveCanvas.strokeStyle = "black";
// 		waveCanvas.beginPath();
// 		waveCanvas.moveTo(0,buf[0]);
// 		for (var i=1;i<512;i++) {
// 			waveCanvas.lineTo(i,128+(buf[i]*128));
// 		}
// 		waveCanvas.stroke();
// 	}

//  	if (ac == -1) {
//  		detectorElem.className = "vague";
// 	 	pitchElem.innerText = "--";
// 		noteElem.innerText = "-";
// 		detuneElem.className = "";
// 		detuneAmount.innerText = "--";
//  	} else {
// 	 	detectorElem.className = "confident";
// 	 	let pitch: any = ac;
// 	 	pitchElem.innerText = Math.round( pitch ) ;
// 	 	let note: any =  noteFromPitch( pitch );
// 		noteElem.innerHTML = noteStrings[note%12];
// 		let  detune: any = centsOffFromPitch( pitch, note );
// 		if (detune == 0 ) {
// 			detuneElem.className = "";
// 			detuneAmount.innerHTML = "--";
// 		} else {
// 			if (detune < 0)
// 				detuneElem.className = "flat";
// 			else
// 				detuneElem.className = "sharp";
// 			detuneAmount.innerHTML = Math.abs( detune );
// 		}
// 	}

// 	if (!window.requestAnimationFrame)
// 		window.requestAnimationFrame = window.webkitRequestAnimationFrame;
// 	rafID = window.requestAnimationFrame( updatePitch );
// }
