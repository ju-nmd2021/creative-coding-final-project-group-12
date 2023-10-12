// The lines x-x were adapted from https://www.youtube.com/watch?v=mhjuuHl6qHM&t=2253s&ab_channel=TheCodingTrain Accessed: 2023-09-25
// I followed the referenced tutorial above on creating a flocking simulation which is not my original idea. However, I have made my own changes to the code

let img;
let imgURL = "image.jpg";
let colorValue;
let dotSize = 1;
let colorPicker;

let x = 440;
let y = 250;

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

  for (let i = 0; i < random(400, 700); i++) {
    flock.push(new Dot(createVector(random(width), random(height)), dotSize));
  }

  alignSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider = createSlider(0, 5, 1, 0.1);
  separationSlider = createSlider(0, 5, 1, 0.1);
  dotSizeSlider = createSlider(0, 5, 1, 0.2);

  alignSlider.position(48, 68);
  alignSlider.style("width", "150px");

  cohesionSlider.position(48, 118);
  cohesionSlider.style("width", "150px");

  separationSlider.position(48, 168);
  separationSlider.style("width", "150px");

  dotSizeSlider.position(48, 218);
  dotSizeSlider.style("width", "150px");

  colorPicker = createColorPicker("#db70bb");
  colorPicker.position(270, 70);
}

function draw() {
  dotSize = dotSizeSlider.value();

  for (let dot of flock) {
    dot.dotSize = dotSize;
    dot.edges();
    dot.flock(flock);
    dot.update();
    dot.display();
  }

  push();
  noStroke();
  fill("#cccccc4D");
  rect(0, 0, 440, 250);
  pop();

  push();
  textSize(14);
  fill(30);
  text("Treat each dot as a living being and make them create art for you!", 20, 25);
  textSize(12);
  text("I want to follow my neighbours:", 43, 55);
  text("No", 20, 73);
  text("Yes", 198, 73);
  text("I want to hug my neighbours:", 43, 105);
  text("No", 20, 123);
  text("Yes", 198, 123);
  text("I want to keep my distance:", 43, 155);
  text("No", 20, 173);
  text("Yes", 198, 173);
  text("Size:", 43, 205);
  text("0", 27, 223);
  text("5", 198, 223);
  text("Colorpicker:", 255, 55);
  text(
    "Create new dots (in the color of your choice chosen through the colorpicker) by pressing the mouse",
    255,
    105,
    125
  );
  text("NOTE! The dots are scared of your mouse...", 255, 195, 125);
  pop();

  push();
  textSize(14);
  fill("#4ad486");
  rect(20, 260, 50, 30);
  fill(0);
  text("Save", 29, 280);
  pop();

  mousePositionDots();
}

function mousePositionDots() {
  if ((mouseIsPressed && mouseX > x && mouseY > 0) || (mouseIsPressed && mouseY > y && mouseX > 0)) {
    flock.push(new mouseDot(createVector(mouseX, mouseY), colorPicker.color(), dotSize));
  }
}

function mouseClicked() {
  if (mouseY > 260 && (mouseY < 290) & (mouseX > 20) && mouseX < 70) {
    save("myArt.jpg");

    return false;
  }
}

class Dot {
  constructor(position, dotSize) {
    this.pos = position;
    this.vel = p5.Vector.random2D();
    // The velocity is a random value between 0.5 and 5 (speed)
    this.vel.setMag(random(0.5, 5));
    this.acc = createVector();
    this.maxForce = 0.4;
    this.maxSpeed = 2;
    this.dotSize = dotSize;
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

  align(dots) {
    let perceptionRadius = random(50, 70);
    let steering = createVector();
    let total = 0;

    for (let surroundingDots of dots) {
      if (surroundingDots && surroundingDots.pos && this.pos) {
        let distance = this.pos.dist(surroundingDots.pos);
        // As long as other isn't me and the distance is less than 100, add it up and divide by the total
        if (distance < perceptionRadius && surroundingDots != this) {
          steering.add(surroundingDots.vel);
          total++;
        }
      }
    }

    // I only want to divide by the total if total is greate than 0
    if (total > 0) {
      steering.div(total).setMag(this.maxSpeed).sub(this.vel).limit(this.maxForce);
    }

    return steering;
  }

  // Same as align, BUT we are subtracting this.pos
  cohesion(dots) {
    let perceptionRadius = random(60, 80);
    let steering = createVector();
    let total = 0;

    for (let surroundingDots of dots) {
      let distance = this.pos.dist(surroundingDots.pos);
      if (distance < perceptionRadius && surroundingDots != this) {
        // Adding up the velocities of any surrounding dot
        steering.add(surroundingDots.pos);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total).sub(this.pos).setMag(this.maxSpeed).sub(this.vel).limit(this.maxForce);
    }

    return steering;
  }

  separation(dots) {
    let perceptionRadius = random(50, 70);
    let steering = createVector();
    let total = 0;

    for (let surroundingDots of dots) {
      let distance = this.pos.dist(surroundingDots.pos);

      if (distance < perceptionRadius && surroundingDots != this) {
        let diff = p5.Vector.sub(this.pos, surroundingDots.pos);
        diff.div(distance);
        steering.add(diff);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total).setMag(this.maxSpeed).sub(this.vel).limit(this.maxForce);
    }

    // Always return a vector or 0 if none
    return steering;
  }

  fleeMouse() {
    let perceptionRadius = random(70, 100);
    let steering = createVector();
    let total = 0;

    let distance = this.pos.dist(createVector(mouseX, mouseY));

    if (distance < perceptionRadius) {
      let diff = p5.Vector.sub(createVector(mouseX, mouseY), this.pos);
      diff.div(distance);
      steering.sub(diff);
      total++;
    }

    if (total > 0) {
      return steering.div(total).setMag(this.maxSpeed).sub(this.vel).limit(this.maxForce);
    }

    return steering;
  }

  flock(dots) {
    // Force accumulation: Having both alignment, cohesion and separation at the same time
    this.acc.set(0, 0); // Or mult(0);
    let alignment = this.align(dots);
    let cohesion = this.cohesion(dots);
    let separation = this.separation(dots);
    let fleeMouse = this.fleeMouse();

    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    // Add them together to get a net force of 0
    this.acc.add(alignment);
    this.acc.add(cohesion);
    this.acc.add(separation);
    this.acc.add(fleeMouse);
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
    ellipse(this.pos.x, this.pos.y, this.dotSize);
    pop();
  }
}

class mouseDot extends Dot {
  constructor(position, col, dotSize) {
    super(position, dotSize);
    this.col = col;
  }

  display() {
    push();
    noStroke();
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, this.dotSize);
    pop();
  }
}
