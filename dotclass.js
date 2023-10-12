export default class Dot {
  constructor(position) {
    this.pos = position;
    // Gives you a random velocity vector (no hard coded values) of unit length 1
    this.vel = p5.Vector.random2D();
    // The velocity is a random value between 0.5 and 3 (speed)
    this.vel.setMag(random(0.5, 3));
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
    let perceptionRadius = 70;
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
    // Force accumulation: Having both alignment, cohesion and separation at the same time
    this.acc.set(0, 0); // Or mult(0);
    let alignment = this.align(dots);
    let cohesion = this.cohesion(dots);
    let separation = this.separation(dots);

    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    // Add them together to get a net force of 0
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
    ellipse(this.pos.x, this.pos.y, this.dotSize);
    pop();
  }
}