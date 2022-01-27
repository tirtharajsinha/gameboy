import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js";
const SPEED = 0.05;

const groundElem = document.querySelectorAll("[data-ground");

export function setupGround() {
  setCustomProperty(groundElem[0], "--left", 0);
  setCustomProperty(groundElem[1], "--left", 300);
}

export function updateGround(delta, speedscale) {
  groundElem.forEach((ground) => {
    incrementCustomProperty(ground, "--left", delta * speedscale * SPEED * -1);
    if (getCustomProperty(ground, "--left") <= -300) {
      incrementCustomProperty(ground, "--left", 600);
    }
  });
}
