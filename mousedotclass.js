export default class mouseDot extends Dot {
  constructor(position, colMouse) {
    super(position);
    this.col = colMouse;
  }

  display() {
    noStroke();
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, this.dotSize);
  }
}
