// The lines x-x were adapted from https://www.youtube.com/watch?v=mhjuuHl6qHM&t=2253s&ab_channel=TheCodingTrain Accessed: 2023-09-25
// I followed the referenced tutorial above on creating a flocking simulation which is not my original idea. However, I have made my own changes to the code

import Dot from "dotclass.js";
import mouseDot from "mousedotclass.js";

let img;
let imgURL = "image.jpg";
let dotSize = 1;
let colorPicker;

let x = 330;
let y = 180;

const flock = [];

let alignSlider;
let cohesionSlider;
let separationSlider;
let dotSizeSlider;

function preload() {
  img = loadImage(imgURL);
  img.resize(innerWidth, innerHeight);
}
window.preload = preload;

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(255);

  for (let i = 0; i < random(400, 700); i++) {
    flock.push(new Dot(createVector(random(width), random(height)), dotSize));
  }

  // Background rectangle for control panel
  push();
  noStroke();
  fill("#f1f1f1");
  rect(0, 0, 330, 180);
  pop();

  alignSlider = createSlider(0, 7, 1, 0.1);
  cohesionSlider = createSlider(0, 7, 1, 0.1);
  separationSlider = createSlider(0, 7, 1, 0.1);
  dotSizeSlider = createSlider(0, 7, 1, 0.5);
  dotSize = dotSizeSlider.value();

  alignSlider.position(30, 50);
  alignSlider.style("width", "150px");

  cohesionSlider.position(30, 90);
  cohesionSlider.style("width", "150px");

  separationSlider.position(30, 130);
  separationSlider.style("width", "150px");

  dotSizeSlider.position(30, 170);
  dotSizeSlider.style("width", "150px");

  colorPicker = createColorPicker("#9571e3");
  colorPicker.position(220, 55);
}
window.setup = setup;

function draw() {
  for (let dot of flock) {
    dot.edges();
    dot.flock(flock);
    dot.update();
    dot.display();
  }

  push();
  textSize(12);
  noStroke();
  fill(30);
  text("Alignment:", 15, 28);
  text("Cohesion:", 15, 68);
  text("Separation:", 15, 108);
  text("Size:", 15, 148);
  text("Colorpicker:", 195, 28);
  text(
    "Create new dots (in the color of your choice chosen through the colorpicker) by pressing the mouse",
    195,
    75,
    125
  );
  pop();

  mousePositionDots();
}

function mousePositionDots() {
  if (mouseIsPressed && mouseX > x && mouseY > y) {
    flock.push(new mouseDot(createVector(mouseX, mouseY), colorPicker.color(), dotSize));
  }
}
window.draw = draw;
