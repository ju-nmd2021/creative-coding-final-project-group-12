let img;
let imgURL = "image.jpg";

function preload() {
  img = loadImage(imgURL);
  img.resize(innerWidth, innerHeight);
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(255);
}

function draw() {}

class Dot {
  constructor() {}

  update() {}

  display() {}
}
