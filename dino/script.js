import { setupGround, updateGround } from "./ground.js";
import { updateDino, setupDino, getDinoRect, setdinoLose } from "./dino.js";
import { updateCactus, setupCactus, getCactusRects } from "./cactas.js";

const gameoversound = new Audio("../audio/audio5.wav");
const ScoreSound = new Audio("../audio/audio2.wav");
const collitionSound = new Audio("../audio/fallOnGround.wav");

let rules = false;
const WORLD_WIDTH = 100;
let WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREMENT = 0.00001;
const worldElem = document.querySelector("[data-world]");
const scoreElem = document.querySelector("[data-score]");
const startScreenElem = document.querySelector("[data-start]");

setPixelToWorldScale();
document.body.addEventListener("resize", setPixelToWorldScale);

document.addEventListener("keydown", gameEngine, { once: true });
worldElem.addEventListener("click", gameEngine, { once: true });

function gameEngine() {
  console.log("starting game;");
  let lastTime;
  let speedScale = 1;
  let score = 0;

  function update(time) {
    if (lastTime == null) {
      lastTime = time;
      window.requestAnimationFrame(update);
      return;
    }
    const delta = time - lastTime;
    updateSpeedScale(delta);
    updateDino(delta, speedScale);
    updateCactus(delta, speedScale);
    updateGround(delta, speedScale);
    update_score(delta);
    if (checkLose()) {
      collitionSound.play();
      return handleLose();
    }
    lastTime = time;

    window.requestAnimationFrame(update);
  }

  function checkLose() {
    const DinoRect = getDinoRect();
    return getCactusRects().some((rect) => isCollision(rect, DinoRect));
  }

  function isCollision(rect1, rect2) {
    return (
      rect1.left + 20 < rect2.right - 10 &&
      rect1.top + 50 < rect2.bottom &&
      rect1.right - 20 > rect2.left &&
      rect1.bottom > rect2.top
    );
  }

  function update_score(delta) {
    score += delta * 0.01;
    scoreElem.textContent = Math.floor(score);
    if (Math.floor(score) % 100 == 0) {
      ScoreSound.play();
    }
  }
  function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREMENT;
  }

  function handleLose() {
    setdinoLose();
    gameOverDialog(Math.floor(score));
  }

  function start() {
    setupGround();
    setupDino();
    setupCactus();
    startScreenElem.classList.add("hide");
    window.requestAnimationFrame(update);
  }

  start();
}

function setPixelToWorldScale() {
  let worldToPixelScale;
  if (document.body.clientWidth / document.body.clientHeight < 1) {
    WORLD_HEIGHT = 35;
  }
  if (
    document.body.clientWidth / document.body.clientHeight <
    WORLD_WIDTH / WORLD_HEIGHT
  ) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }
  console.log(worldToPixelScale);

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
  // console.log("hi");
}

// handelling the ruls dialog
document.getElementById("rules-btn").addEventListener("click", (e) => {
  if (rules) {
    rules = false;

    document.querySelector("#rules h5").style.opacity = "1";
    document.querySelector("#rules ul").style.opacity = "1";
    document.getElementById("rules-btn").style.color = "#fff";
    document.getElementById("rules").style.width = "0px";
    document.getElementById("rules").style.height = "0px";
    document.getElementById("rules").style.padding = "0px";
  } else {
    rules = true;
    var rs = getComputedStyle(document.getElementById("rules"));
    document.getElementById("rules").style.display = "flex";
    document.getElementById("rules-btn").style.color = "tomato";
    document.getElementById("rules").style.width =
      rs.getPropertyValue("--thiswidth");
    document.getElementById("rules").style.height =
      rs.getPropertyValue("--thisheight");
    document.getElementById("rules").style.padding =
      rs.getPropertyValue("--thispadding");
    setTimeout(() => {
      document.querySelector("#rules h5").style.opacity = "1";
      document.querySelector("#rules ul").style.opacity = "1";
    }, 420);
  }
});
document.getElementById("rules-btn").addEventListener("blur", (e) => {
  setTimeout(() => {
    rules = false;
    document.querySelector("#rules h5").style.opacity = "1";
    document.querySelector("#rules ul").style.opacity = "1";
    document.getElementById("rules-btn").style.color = "#fff";
    document.getElementById("rules").style.width = "0px";
    document.getElementById("rules").style.height = "0px";
    document.getElementById("rules").style.padding = "0px";
  }, 500);
});

function gameOverDialog(score) {
  setTimeout(() => {
    document.getElementById("gameover").style.display = "flex";
    document.getElementById("finalscore").innerHTML = score;
    let msg = "GAME OVER";
    document.getElementById("msg").innerHTML = msg;
    gameoversound.play();
  }, 500);
}
document.querySelector("#reload").addEventListener("click", (e) => {
  document.querySelector(".gameover").style.display = "none";
  setupGround();
  setupDino();
  setupCactus();
  document.addEventListener("keydown", gameEngine, { once: true });
  worldElem.addEventListener("click", gameEngine, { once: true });
  scoreElem.textContent = 0;
  startScreenElem.classList.remove("hide");
});
