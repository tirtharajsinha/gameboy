const INITIAL_VELOCITY = 0.025;
const VELOCITY_INCREASE = 0.00001;
const hitsound = new Audio("../audio/audio2.wav");

export default class Ball {
  constructor(ballElem, board) {
    this.ballElem = ballElem;
    this.board = board;
    this.rectofboard = this.rectofboard();
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
  }
  set x(value) {
    this.ballElem.style.setProperty("--x", value);
  }

  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
  }
  set y(value) {
    this.ballElem.style.setProperty("--y", value);
  }

  rect() {
    return this.ballElem.getBoundingClientRect();
  }

  rectofboard() {
    return this.board.getBoundingClientRect();
  }

  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = { x: 0 };
    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI);
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }
    this.velocity = INITIAL_VELOCITY;
  }

  update(delta, paddleRects) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += VELOCITY_INCREASE * delta;
    const rect = this.rect();
    const rectofboard = this.rectofboard;

    if (rect.bottom >= rectofboard.bottom || rect.top <= rectofboard.top) {
      this.direction.y *= -1;
    }

    if (paddleRects.some((r) => isCollition(r, rect))) {
      this.direction.x *= -1;
      console.log("collition");
      hitsound.play();
    }
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function isCollition(rect1, rect2) {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  );
}
