export const setup = p5 => () => {
  window.p = p5
  p.createCanvas(500, 500)
}

export const draw = () => {
  p.noStroke();
  p.ellipse(p.mouseX, p.mouseY, 4, 4);
}
