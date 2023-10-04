// The lines x-x were adapted from https://www.youtube.com/watch?v=mhjuuHl6qHM&t=2253s&ab_channel=TheCodingTrain Accessed: 2023-09-25
// I followed the referenced tutorial above on creating a flocking simulation which is not my original idea. However, I have made my own changes to the code

let img;
let imgURL = "image.jpg";
let colorValue;
let dotSize = 1;

const flock = [];

let alignSlider;
let cohesionSlider;
let separationSlider;
let dotSizeSlider;

function preload() {
  img = loadImage(imgURL);
  img.resize(innerWidth, innerHeight);
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(255);

  alignSlider = createSlider(0, 7, 1, 0.1);
  cohesionSlider = createSlider(0, 7, 1, 0.1);
  separationSlider = createSlider(0, 7, 1, 0.1);

  dotSizeSlider = createSlider(0, 7, 1, 0.1);
  dotSize = dotSizeSlider.value();

  push();
  textSize(12);
  noStroke();
  fill(0);

  text("Alignment:", 15, 28);
  alignSlider.position(30, 50);
  alignSlider.style("width", "150px");

  text("Cohesion:", 15, 68);
  cohesionSlider.position(30, 90);
  cohesionSlider.style("width", "150px");

  text("Separation:", 15, 108);
  separationSlider.position(30, 130);
  separationSlider.style("width", "150px");

  text("Size:", 15, 148);
  dotSizeSlider.position(30, 170);
  dotSizeSlider.style("width", "150px");
  pop();

  for (let i = 0; i < random(150, 500); i++) {
    flock.push(new Dot());
  }
}

function draw() {
  for (let dot of flock) {
    dot.edges();
    dot.flock(flock);
    dot.update();
    dot.display();
  }
}

class Dot {
  constructor() {
    this.pos = createVector(random(width), random(height));
    // Gives you a random velocity vector (no hard coded values) of unit length 1
    this.vel = p5.Vector.random2D();
    // The velocity is a random value between 0.5 and 3 (speed)
    this.vel.setMag(random(0.5, 3));
    this.acc = createVector();
    this.maxForce = 0.4;
    this.maxSpeed = 2;
  }

  edges() {
    if (this.pos.x > innerWidth) {
      this.pos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = innerWidth;
    }
    if (this.pos.y > innerHeight) {
      this.pos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = innerHeight;
    }
  }

  // This function align this dot with all other dots
  // Getting the average velocity of all the dots within a certain radius
  align(dots) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;

    for (let surroundingDots of dots) {
      let distance = dist(this.pos.x, this.pos.y, surroundingDots.pos.x, surroundingDots.pos.y);
      // As long as other isn't me and the distance is less than 100, add it up and divide by the total
      if (distance < perceptionRadius && surroundingDots != this) {
        steering.add(surroundingDots.vel);
        total++;
      }
    }

    // I only want to divide by the total if total is greate than 0
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      // Steering = Desired velocity - Velocity
      steering.sub(this.vel);
      // Limits the magnitude of a vector
      steering.limit(this.maxForce);
    }

    return steering;
  }

  // Same as align, BUT we are subtracting this.pos
  cohesion(dots) {
    let perceptionRadius = 100;
    let steering = createVector();
    let total = 0;

    for (let surroundingDots of dots) {
      let distance = dist(this.pos.x, this.pos.y, surroundingDots.pos.x, surroundingDots.pos.y);
      // As long as other dot isn't me and the distance is less than 100, add it up and divide by the total
      if (distance < perceptionRadius && surroundingDots != this) {
        // Adding up the velocities of any surrounding dot
        steering.add(surroundingDots.pos);
        total++;
      }
    }

    // I only want to divide by the total if total is greater than 0
    if (total > 0) {
      steering.div(total);
      steering.sub(this.pos);
      steering.setMag(this.maxSpeed);
      // Steering = Desired velocity - Velocity
      steering.sub(this.vel);
      steering.limit(this.maxForce);
    }

    return steering;
  }

  separation(dots) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;

    for (let surroundingDots of dots) {
      let distance = dist(this.pos.x, this.pos.y, surroundingDots.pos.x, surroundingDots.pos.y);
      // As long as other isn't me and the distance is less than 100, add it up and divide by the total
      if (distance < perceptionRadius && surroundingDots != this) {
        let diff = p5.Vector.sub(this.pos, surroundingDots.pos);
        diff.div(distance);
        steering.add(diff);
        total++;
      }
    }

    // I only want to divide by the total if total is greate than 0
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      // Steering = Desired velocity - Velocity
      steering.sub(this.vel);
      steering.limit(this.maxForce);
    }

    // Always return a vector or 0 if none
    return steering;
  }

  flock(dots) {
    // Force accumulation: Having both alignment, cohesion and separation
    this.acc.set(0, 0); // Or mult(0);
    let alignment = this.align(dots);
    let cohesion = this.cohesion(dots);
    let separation = this.separation(dots);

    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    // Add them together to get net force 0
    this.acc.add(alignment);
    this.acc.add(cohesion);
    this.acc.add(separation);
  }

  update() {
    // The position is updated based on the velocity
    this.pos.add(this.vel);
    // The velocity is updated based on the acceleration
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
  }

  display() {
    push();
    noStroke();
    let col = img.get(random(this.pos.x), random(this.pos.y));
    fill(col);
    ellipse(this.pos.x, this.pos.y, dotSize);
    pop();
  }
}
