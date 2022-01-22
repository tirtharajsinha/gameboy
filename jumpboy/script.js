let rules = false;
const movesound = new Audio("../audio/audio2.wav");
const gameoversound = new Audio("../audio/bomb.wav");
const gamesound = new Audio("../audio/spacesound.mp3");
gamesound.volume = 0.5;
gamesound.loop = true;

document.addEventListener("DOMContentLoaded", gameEngine);

function gameEngine() {
  const grid = document.querySelector(".grid");
  const doodler = document.createElement("div");
  let doodlerLeftSpace = 50;
  let startpoint = 150;
  let doodlerBottomSpace = startpoint;
  let isgamestarted = false;
  let isgameover = false;
  let platformcount = 3;
  let platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let score = 0;
  let speed = 30;

  // create doodler at the start.
  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add("doodler");
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = platforms[0].left + 20 + "px";
    doodler.style.bottom = platforms[0].bottom + 20 + "px";
  }

  // creates new platform
  class Platform {
    constructor(newPlatBottom) {
      this.bottom = newPlatBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement("div");
      const visual = this.visual;
      visual.classList.add("platform");
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      grid.appendChild(visual);
    }
  }

  // add new platforms at the start.
  function createPlatforms() {
    for (let i = 0; i < platformcount; i++) {
      let platGap = 600 / platformcount;
      let newPlatBottom = 100 + i * platGap;
      let newplatform = new Platform(newPlatBottom);
      platforms.push(newplatform);
    }
    console.log(platforms);
  }

  // moves the platforms
  function movePlatforms() {
    if (doodlerBottomSpace > 200) {
      platforms.forEach((platform) => {
        platform.bottom -= 4;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + "px";
        // removing bottomest platform and create 1 new platform
        if (platform.bottom < 10) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove("platform");
          platforms.shift();

          let newplatform = new Platform(600);
          platforms.push(newplatform);

          // updating score
          score++;
          document.getElementById("score").innerHTML = score;
        }
      });
    }
  }

  // func for initiate jump
  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(() => {
      if (doodlerBottomSpace < 450) {
        doodlerBottomSpace += 20;
        doodler.style.bottom = doodlerBottomSpace + "px";
      } else {
        fall();
      }
      //   console.log(doodlerBottomSpace, startpoint);
      if (doodlerBottomSpace > startpoint + 200) {
        fall();
      }
    }, speed);
  }

  // func for initiate falling
  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(() => {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = doodlerBottomSpace + "px";
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      // checking condition of landing on platform
      platforms.forEach((platform) => {
        if (
          doodlerBottomSpace >= platform.bottom &&
          doodlerBottomSpace <= platform.bottom + 20 &&
          doodlerLeftSpace + 40 >= platform.left &&
          doodlerLeftSpace <= platform.left + 75 &&
          !isJumping
        ) {
          console.log("landed");
          startpoint = doodlerBottomSpace;
          jump();
        }
      });
    }, speed);
  }

  // start game over actions
  function gameOver() {
    console.log("game over");
    isgameover = true;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    document.getElementById("finalscore").innerHTML = score;
    document.querySelector(".gameover").style.display = "flex";
    gameoversound.play();
  }

  // controlling the movement of the doodler
  function control(e) {
    if (e.key === "ArrowLeft") {
      movesound.play();
      moveleft(); //   moveleft
      console.log("moving left");
    } else if (e.key === "ArrowRight") {
      movesound.play();
      moveRight(); // moveright
    } else if (e.key === "ArrowUp") {
      movestraight(); // movestraight
    }
  }

  // moves doodler left
  function moveleft() {
    if (doodlerLeftSpace >= 35) {
      doodlerLeftSpace -= 50;
      doodler.style.left = doodlerLeftSpace + "px";
    }
  }

  // moves doodler right
  function moveRight() {
    if (doodlerLeftSpace <= 330) {
      doodlerLeftSpace += 50;
      doodler.style.left = doodlerLeftSpace + "px";
    }
  }

  function movestraight() {}

  function start() {
    if (!isgameover) {
      createPlatforms();
      createDoodler();
      setInterval(movePlatforms, 30);
      document.addEventListener("keyup", control);
    }
  }
  document.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      if (!isgamestarted && !isgameover) {
        gamesound.play();
        isgamestarted = true;
        jump();
      }
    }
  });
  start();
}

document.querySelector("#reload").addEventListener("click", (e) => {
  document.querySelector(".gameover").style.display = "none";
  document.querySelector(".grid").innerHTML = "";
  gameEngine();
});

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

    document.getElementById("rules").style.display = "flex";
    document.getElementById("rules-btn").style.color = "tomato";
    document.getElementById("rules").style.width = "350px";
    document.getElementById("rules").style.height = "590px";
    document.getElementById("rules").style.padding = "20px";
    setTimeout(() => {
      document.querySelector("#rules h5").style.opacity = "1";
      document.querySelector("#rules ul").style.opacity = "1";
    }, 420);
  }
});
document.getElementById("rules-btn").addEventListener("blur", (e) => {
  rules = false;

  document.querySelector("#rules h5").style.opacity = "1";
  document.querySelector("#rules ul").style.opacity = "1";
  document.getElementById("rules-btn").style.color = "#fff";
  document.getElementById("rules").style.width = "0px";
  document.getElementById("rules").style.height = "0px";
  document.getElementById("rules").style.padding = "0px";
});

setTimeout(() => {
  document.getElementById("rules-btn").click();
  console.log("clicked");
}, 1000);

setTimeout(() => {
  if (rules) {
    document.getElementById("rules-btn").click();
  }
}, 10000);
