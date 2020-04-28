// import {
//   setup,
//   draw,
// } from './sketch.js';

// new p5(p => {
//   p.setup = setup(p);
//   p.draw = draw;
// });

const WIDTH = 1000;
const HEIGHT = 1000;

const canvas = document.createElement('canvas');
canvas.width  = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

const buffer = new Uint8ClampedArray(4 * HEIGHT * WIDTH);

const setPixel = (x, y, val) => {
  const index = 4 * (y + x * WIDTH)
  buffer[index] = val[0];
  buffer[index + 1] = val[1];
  buffer[index + 2] = val[2];
  buffer[index + 3] = val[3];
};

const xc = WIDTH / 2;
const yc = HEIGHT / 2;
setInterval(() => {
  for (let i = 0; i < 100000; i+=1) {
    const rx = Math.random() * 250
    const ry = Math.random() * 250
    setPixel(
      xc + Math.round(-Math.sin(i)*rx* Math.random()),
      yc + Math.round(Math.random() * Math.random() * Math.cos(i)*ry),
      [Math.round(-Math.sin(i)*rx* Math.random())*100, Math.round(-Math.sin(i)*rx* Math.random())*-100, Math.round(-Math.sin(i)*rx* Math.random()), 100]
    );
  }
  const iData = new ImageData(buffer, WIDTH, HEIGHT);
  ctx.putImageData(iData, 0, 0);
}, 20);
