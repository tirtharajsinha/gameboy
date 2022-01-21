document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const doodler = document.createElement("div");
  let doodlerLeftSpace = 50;
  let startpoint = 150;
  let doodlerBottomSpace = startpoint;
  let isgamestarted = false;
  let reload;
  let isgameover = false;
  let platformcount = 3;
  let platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let score = 0;
  let speed = 30;
  const movesound = new Audio("../audio/audio2.wav");
  const gameoversound = new Audio("../audio/bomb.wav");
  const gamesound = new Audio("../audio/spacesound.mp3");
  gamesound.volume = 0.5;
  gamesound.loop = true;

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add("doodler");
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = platforms[0].left + 20 + "px";
    doodler.style.bottom = platforms[0].bottom + 20 + "px";
  }

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
  function createPlatforms() {
    for (let i = 0; i < platformcount; i++) {
      let platGap = 600 / platformcount;
      let newPlatBottom = 100 + i * platGap;
      let newplatform = new Platform(newPlatBottom);
      platforms.push(newplatform);
    }
    console.log(platforms);
  }

  function movePlatforms() {
    if (doodlerBottomSpace > 200) {
      platforms.forEach((platform) => {
        platform.bottom -= 4;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + "px";

        if (platform.bottom < 10) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove("platform");
          platforms.shift();
          let newplatform = new Platform(600);
          platforms.push(newplatform);
          score++;
          document.getElementById("score").innerHTML = score;
        }
      });
    }
  }

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

  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(() => {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = doodlerBottomSpace + "px";
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach((platform) => {
        if (
          doodlerBottomSpace >= platform.bottom &&
          doodlerBottomSpace <= platform.bottom + 20 &&
          doodlerLeftSpace + 35 >= platform.left &&
          doodlerLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          console.log("landed");
          startpoint = doodlerBottomSpace;
          jump();
        }
      });
    }, speed);
  }

  function gameOver() {
    console.log("game over");
    isgameover = true;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    document.querySelector(".reload").style.display = "block";
    gameoversound.play();
  }

  function control(e) {
    movesound.play();
    if (e.key === "ArrowLeft") {
      moveleft(); //   moveleft
      console.log("moving left");
    } else if (e.key === "ArrowRight") {
      moveRight(); // moveright
    } else if (e.key === "ArrowUp") {
      movestraight(); // movestraight
    }
  }

  function moveleft() {
    if (doodlerLeftSpace >= 35) {
      doodlerLeftSpace -= 50;
      doodler.style.left = doodlerLeftSpace + "px";
    }
  }
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
        console.log("jump 1");
      } else if (isgamestarted && reload) {
        console.log(reload + "1");
        reload = false;
        console.log(reload + "2");
        jump();
        console.log("jump 2");
      }
    }
  });
  document.querySelector(".reload").addEventListener("click", (e) => {
    if (isgamestarted && isgameover) {
      document.querySelector(".grid").innerHTML = "";
      doodlerLeftSpace = 50;
      startpoint = 150;
      doodlerBottomSpace = startpoint;
      platformcount = 3;
      isgameover = false;
      platforms = [];
      upTimerId;
      downTimerId;
      isJumping = true;
      score = 0;
      document.getElementById("score").innerHTML = score;
      reload = true;
      start();
    }
  });

  start();
});
