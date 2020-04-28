
var capturer = new CCapture({
  format: 'webm',
  framerate: 30,
	verbose: true,
});

let p = null
let bgImg = null

let x = 1002
let y = 100

let MidiIn = null
let MidiOut = null
let MidiConnected = false

let poly = []
let n = 100

const w = 900
const h = 600

const incomingMidi = {}

let distCounter = 0
let distCounterIncrement = 1

WebMidi.enable((err) => {
  err && console.log("WebMidi could not be enabled.", err)
  MidiIn = WebMidi.inputs[0] // Digitone
  MidiOut = WebMidi.outputs[0] // Digitone
  MidiIn.addListener('controlchange', "all", (m) => {
    incomingMidi[m.controller.number] = m.value;
  })
})

setInterval(() => {
  incomingMidi[70] = Math.round(Math.random() * 128);
  incomingMidi[71] = Math.round(Math.random() * 128);
  incomingMidi[72] = Math.round(Math.random() * 128);
  incomingMidi[73] = Math.round(Math.random() * 128);
}, 500)

let noiseScale=0.01;

export const setup = p5 => () => {
  p = p5;
  p.createCanvas(w, h)
  playSeq()
  playSeq2();
  p.frameRate(30)
  // bgImg = p.loadImage('01.png');

  p.strokeWeight(12)
  p.noFill()
  for (let i = 0; i < n; i++) {
  	let a = {
      y: (h/2) + 100 * p.sin(p.map(i, 0, n-1, 0, p.TAU)),
      x: (w/2) + 100 * p.cos(p.map(i, 0, n-1, 0, p.TAU))
    }
  	poly.push(a)
  }
  n = 0
  capturer.start();
}

let strokeCounter = 0;
let bellCounter = 0
let bellPos = {x: null, y: null}
let counter = 0;
export const draw = p => () => {
  n = getMidiValue(70) || n
  if (n > 100) { n = 100 }
  if (n < 5) { n = 0 }
  distCounterIncrement = getMidiValue(71) / 8
  let strokeChange = getMidiValue(73)
  if (strokeChange) {
    strokeCounter += 1;
    if (strokeCounter > (1200 / getMidiValue(70))) {
      strokeCounter = 0;
    }
  }
  p.strokeWeight(n/3 + (strokeCounter*2))
  p.blendMode(p.BLEND)
  p.background(20);
  for (let x=0; x < w; x++) {
    let noiseVal = p.noise(x*x*noiseScale, 2*distCounterIncrement*noiseScale);
    p.stroke(noiseVal*255*getMidiValue(71)/100);
    p.line(x, distCounterIncrement+noiseVal*(1000/(getMidiValue(71)/128)), x, h);
  }
  p.blendMode(p.ADD)
  p.stroke(255, 0, 0)
  drawPoly(1000, 1000)

  p.stroke(0, 255, 0)
  drawPoly(1400, 1800)

  p.stroke(0, 0, 255)
  drawPoly(2000, 1700)
  // p.tint(255, 127);
  p.blendMode(p.BLEND)
  if (justBell) {
    bellCounter += 1;
    // p.color('white')
    if (!bellPos.x && !bellPos.y) {
      bellPos.x = Math.random() * (w-200) + 100;
      bellPos.y = Math.random() * (h-200) + 100;
    }
    // p.stroke(255 - bellCounter*8, 150*Math.random(), 50);
    let opacity = 4 / getMidiValue(70)
    if (opacity > 1) opacity = 1
    if (getMidiValue(70)) {
      opacity = opacity/2
    } else {
      opacity = opacity/opacity*30/(bellCounter*bellCounter)
    }
    p.stroke(`rgba(${bellCounter*4}%,${Math.random() * 100}%,70%,${opacity})`);
    p.strokeWeight(30-(bellCounter));
    p.circle(bellPos.x, bellPos.y , bellCounter* 10);
    if (bellCounter > 30) {
      bellCounter = 0;
      bellPos.x = 0;
      bellPos.y = 0;
      justBell = false;
    }
  }
  counter++
  if (counter > 240) {
    p.noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }
  capturer.capture(document.getElementById('defaultCanvas0'));
  // p.image(bgImg, 0, 0, bgImg.width / 3, bgImg.height / 4);
}
// setInterval(() => {
//   MidiOut.playNote("F5", 1, {duration: 100});
//   console.log('note')
// }, 1000);
const getMidiValue = cc => incomingMidi[cc] || 0

const notes = [
  "F3", "C3", "G3", "D3","F4", "C4", "G4", "D4",
];
let noteCounter = 0;
function playSeq() {
  MidiOut && MidiOut.sendControlChange(78, getMidiValue(71), 1)
  MidiOut && MidiOut.sendControlChange(19, getMidiValue(72), 1)
  if (getMidiValue(70) > 10) {
    MidiOut && MidiOut.playNote([notes[noteCounter]], 1, {duration: 100});
  }
  // if (getMidiValue(70) > 70) {
  //   MidiOut && MidiOut.playNote([notes2[noteCounter]], 1, {duration: 100});
  // }
  noteCounter += 1;
  if (noteCounter == notes.length) {
    noteCounter = 0;
  }
  let time = getMidiValue(70)
  if (time < 4) time = 4
  setTimeout(() => {
    playSeq();
  }, 12000 / time);
}

const notes2 = [
  "F3", "C3", "G3", "D3",
  "F4", "C4", "G4", "D4",
  "F#5", "F#6",
];
let justBell = false;
function playSeq2() {
  const rand = Math.floor(Math.random() * 10);
  MidiOut && MidiOut.playNote([notes2[rand]], 2, {duration: 400});
  setTimeout(() => {
    playSeq2();
    justBell = true;
  }, 1000 * Math.random() + 300);
}

const drawPoly = (dx, dy) => {
  let g = (getMidiValue(72) - getMidiValue(72)/2) / 10
  p.beginShape()
  distCounter += distCounterIncrement
  if (distCounter > w) { distCounter = 0 }
  for (let i = 0; i < n; i++) {
  	let bias = p.dist(distCounter, w - distCounter, poly[i].x, poly[i].y)
  	p.vertex(poly[i].x + dx / logMap(bias, w, 0, dx, 45) + g*Math.random(), poly[i].y + dy / logMap(bias, h, 0, dy, 45) + g*Math.random())
  }
  p.endShape()
}

const logMap = (value, start1, stop1, start2, stop2) => {
  start2 = p.log(start2)
  stop2 = p.log(stop2)
  return p.exp(start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1)))
}
