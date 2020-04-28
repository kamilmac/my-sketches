let mySound;
const FR = 30;
var capturer = new CCapture({
  format: 'ffmpegserver',
  framerate: FR,
  verbose: true,
  name: "foobar",
  extension: ".mp4",
  codec: "mpeg4",
});

function CAPTURE() {
  frameCount === 1 && capturer.start();
  if (frameCount > 30 * 60 * 0.1) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }
  capturer.capture(document.getElementById('defaultCanvas0'));
};

function preload() {
  mySound = loadSound('5c.wav');
}

//------------------------------------------------------------------------------------------------------


function setup() {
  mySound.play();
  frameRate(FR)
  createCanvas(960, 540);
  fft = new p5.FFT();
  filter = new p5.HighPass();
  mySound.disconnect();
  mySound.connect(filter);
  filter.freq(100);
}

let lastWave = 0;
let arr = [];
let counter = 0;
let avg = 0;
function draw() {
  background(220);
  let waveform = fft.waveform();
  let spectrum = fft.analyze();
  console.log(spectrum.length)
  noFill();
  beginShape();
  stroke(20);
  for (let i = 0; i < waveform.length; i++){
    if (arr.length > 30000) {
      arr.shift();
    }
    arr.push(Math.abs(waveform[i]));
  }
  for (let i = 0; i < arr.length; i++){
    avg = avg + arr[i];
  }
  avg = avg / arr.length;
  for (let i = 0; i < waveform.length; i++){
    let x = map(i, 0, waveform.length, 0, width);
    let y = map( -avg*10, -1, 1, 0, height);
    vertex(x,y);
  }
  endShape();
}
