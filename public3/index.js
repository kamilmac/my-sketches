// let mySound;
// const FR = 30;
// var capturer = new CCapture({
//   format: 'ffmpegserver',
//   framerate: FR,
//   verbose: true,
//   name: "foobar",
//   extension: ".mp4",
//   codec: "mpeg4",
// });

// function CAPTURE() {
//   frameCount === 1 && capturer.start();
//   if (frameCount > 30 * 60 * 0.1) {
//     noLoop();
//     console.log('finished recording.');
//     capturer.stop();
//     capturer.save();
//     return;
//   }
//   capturer.capture(document.getElementById('defaultCanvas0'));
// };

// function preload() {
//   mySound = loadSound('rea.wav');
// }

// //------------------------------------------------------------------------------------------------------


// function setup() {
//   mySound.play();
//   frameRate(FR)
//   createCanvas(960, 540);
//   fft = new p5.FFT();
//   filter = new p5.HighPass();
//   mySound.disconnect();
//   mySound.connect(filter);
//   filter.freq(150);
// }

// let bass_arr = [];
// let amp_arr = [];
// const sL = 256;
// let rytm = {
//   a: [],
//   b: [],
// }
// const LIMIT = FR * 60 * 0.5
// function draw() {
//   let spectrum = fft.analyze(sL);
//   let bass_sum = 0;
//   let amp_sum = 0;
//   bass_sum = spectrum[0] + bass_sum;
//   for (let i = 3; i < sL; i++){
//     amp_sum = spectrum[i] + amp_sum;
//   }
//   amp_sum = amp_sum / (sL-3);

//   bass_arr.push(bass_sum);
//   amp_arr.push(amp_sum);
//   if (bass_arr.length > 4) {
//     bass_arr.shift();
//     amp_arr.shift();
//   }
//   let bass_avg = 0;
//   let amp_avg = 0;
//   for (let i = 0; i < bass_arr.length; i++){
//     bass_avg = bass_avg + bass_arr[i];
//     amp_avg = amp_avg + amp_arr[i];
//   }
//   bass_avg = bass_avg / bass_arr.length
//   amp_avg = amp_avg / bass_arr.length
//   rytm.b.push((bass_avg/256).toFixed(2));
//   rytm.a.push((amp_avg/128).toFixed(2));
//   if (frameCount === LIMIT) {
//     localStorage.setItem('rytm', JSON.stringify(rytm));
//   }
// }

// By Roni Kaufman
let rytmm = JSON.parse(localStorage.getItem('rytm'))


/**
 * color pallet
 */
// let curl = "https://coolors.co/555233-df921d-878937-cfc52A-dc2a41";
// let curl = "https://coolors.co/306b34-1c5253-f3ffc6-c3eb78-b6174b";
// let curl = "https://coolors.co/333745-e63462-fe5f55-c7efcf-eef5db";
let curl = "https://coolors.co/ed6a5a-f4f1bb-9bc1bc-5ca4a9-e6ebe0";

let bgColor;
let seed, noiseArg;
let num;
let obj;
let prev_id, next_id;

function setup() {
  createCanvas(600, 600);
  // colorMode(HSB, 360, 100, 100, 100);
  angleMode(DEGREES);
  background(255);
  // noLoop();
  frameRate(30);

  pal = createPallete(curl);
  let cid = int(random(pal.length));
  bgColor = pal[cid];
  pal.splice(cid, 1);
  pal = shuffle(pal);

  seed = random(1e+4);
  noiseArg = random(1e+4);

  // background(bgColor);
  // effect();  // noise effect
}

function draw() {
  randomSeed(seed);
  background(bgColor);

	// pal = shuffle(pal);

	let step = 80;
	let r1 = 60, r2 = 30;
	for (let j = 0; j < 12; j++) {
		let s = map(j, 0, 12-1, 0.3, 1.2);
		let d = dist(cos(-135)*(r1/2), sin(-135)*(r2/2), cos(45)*(r1/2), sin(45)*(r2/2));
		d = (d / sqrt(2) * 2) * s;
		let col = random(pal);

		for (let i = 0; i < 30; i++) {
			let frame = int(frameCount+i*3+j*3);
			// let col = lerpColor(pal[0], pal[1], map(i*3+j*3, -50, (30-1)*3+(10-1)*3, 0, 1));
			push();
			translate(map(j, 0, 12-1, -500, 500), 0);
			translate(i*d, i*d);
			stroke(0);  strokeWeight(3 * rytmm.a[frameCount]);
			if (int(frame/(step*3))%2==0) { translate(d/2, d/2); }
			scale(s / rytmm.b[frameCount]);
			let t = map(frame%step, 0, step-1, 0, 1);
			let e = easeInQuart(t);
			if (int(frame/step)%3==0) {
				strokeWeight(16);  stroke(10);  noFill();
				arc(0, 0, r1+16/2, r2+16/2, -135, map(e, 0, 1, -135+1, 45));
				strokeWeight(25);  stroke(10);  noFill();
				arc(0, 0, r2+20/2, r1+20/2, -135, map(e, 0, 1, -135+1, 45));
				strokeWeight(20);  stroke(col);  noFill();
				arc(0, 0, r2+20/2, r1+20/2, -135, map(e, 0, 1, -135+1, 45));
			} else if (int(frame/step)%3==1) {
				strokeWeight(16);  stroke(10);  noFill();
				arc(0, 0, r1+16/2, r2+16/2, map(e, 0, 1, -135, 45-1), 45);
				strokeWeight(25);  stroke(10);  noFill();
				arc(0, 0, r2+20/2, r1+20/2, map(e, 0, 1, -135, 45-1), 45);
				strokeWeight(20);  stroke(col);  noFill();
				arc(0, 0, r2+20/2, r1+20/2, map(e, 0, 1, -135, 45-1), 45);
			} else {
				strokeWeight(16);  stroke(10);  noFill();
				arc(0, 0, r1+16/2, r2+16/2, 45-1, 45);
				strokeWeight(25);  stroke(10);  noFill();
				arc(0, 0, r2+20/2, r1+20/2, 45-1, 45);
				strokeWeight(20);  stroke(col);  noFill();
				arc(0, 0, r2+20/2, r1+20/2, 45-1, 45);
			}
			pop();
		}
	}

  // effect();
  drawWindow();
}

function easeInQuart(t) {
  return 1 + (--t) * t * t * t * t;
}

function easeInOutQuart(t) {
  return t < 0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t;
}

function easeInElastic(t) {
  return (0.01 - 0.01 / t) * Math.sin(60 * t) + 1;
}

function keyPressed() {
  if (keyCode == ENTER) {
    save('200124.png');
  }
}

function shadow(bShadow) {
	if (bShadow) {
		drawingContext.shadowOffsetX = 3;
		drawingContext.shadowOffsetY = 3;
		drawingContext.shadowBlur = 6;
		drawingContext.shadowColor = color(30);
		// drawingContext.shadowColor = bgColor;
	} else {
		drawingContext.shadowOffsetX = 0;
		drawingContext.shadowOffsetY = 0;
		drawingContext.shadowBlur = 0;
	}
}

function effect() {
  strokeWeight(1);
  for (let i = 0; i < width * height * 5 / 100; i++) {
    stroke(0, 0, 0, 10);
    let px = random(width);
    let py = random(height);
    point(px, py);
  }
}

function drawWindow() {
  w = width / 30;
  noStroke();
  fill(255);
  rect(0, 0, width, w);
  rect(0, height - w, width, w);
  rect(0, 0, w, height);
  rect(width - w, 0, w, height);
}

function createPallete(_url) {
  let slash_index = _url.lastIndexOf('/');
  let pallate_str = _url.slice(slash_index + 1);
  let arr = pallate_str.split('-');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = color('#' + arr[i]);
  }
  return arr;
}
