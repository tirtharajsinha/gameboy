let rules = false;
const gunshotsound = new Audio("../audio/pistolShot.mp3");
const gameoversound = new Audio("../audio/audio5.wav");
const gamesound = new Audio("../audio/birds.mp3");
const gameoverfeel = new Audio("../audio/Birds-chirping-sound-effect.mp3");
gamesound.loop = true;
gameoverfeel.loop = true;
let isGamedrawen = false;

document.addEventListener("dblclick", (e) => {
  e.preventDefault();
});

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keyup", (e) => {
    if (!isGamedrawen && e.key == "Enter") {
      gameEngine();
    }
  });
  document.querySelector(".game-container").addEventListener("click", (e) => {
    if (!isGamedrawen) {
      gameEngine();
      gunshotsound.pause();
    }
  });
  document.querySelector(".game-container").addEventListener("click", (e) => {
    if (isGamedrawen) {
      gunshotsound.play();
    }
  });
});

// gameEngine
function gameEngine() {
  isGamedrawen = true;
  const gamedisplay = document.querySelector(".game-container");
  let displayWidth = gamedisplay.clientWidth;
  let displayHeight = gamedisplay.clientHeight;
  console.log(displayWidth);
  let birds = [];
  let lastpainttime = 0;
  let frame = 100;
  let NoOfBird = 7;
  let TotalBatch = 4;
  let currentBatch = 0;
  let isGameOver = false;
  let score = 0;
  let birdPassed = 0;
  let TimerID;
  let level = 1;
  let stepDistance = level + 1;
  document.getElementById("score").innerHTML = score + "/" + birdPassed;
  document.querySelector(".enter").style.display = "none";
  gamesound.play();
  gameoverfeel.pause();

  class bird {
    constructor() {
      let a = 30;
      let b = Math.round(displayHeight * 0.7);
      // console.log(b);
      this.top = Math.round(a + (b - a) * Math.random());
      this.left = displayWidth + 20;
      this.SpeedBias = Math.round(2 * Math.random());
      this.visual = document.createElement("div");
      const visual = this.visual;
      visual.classList.add("bird");
      visual.style.left = this.left + "px";
      visual.style.top = this.top + "px";
      gamedisplay.appendChild(visual);
      visual.addEventListener("click", (e) => {
        const gunshotsound = new Audio("../audio/pistolShot.mp3");
        gunshotsound.play();
        score++;
        this.visual.style.display = "none";
      });
    }
  }

  function generateBirds() {
    for (var i = 0; i < NoOfBird; i++) {
      setTimeout(() => {
        let newbird = new bird();
        birds.push(newbird);
        // console.log(birds);
        birdPassed++;
      }, i * 800);
    }
  }

  function main(ctime) {
    if (currentBatch < TotalBatch) {
      window.requestAnimationFrame(main);
      // clearInterval(TimerID);
    } else {
      GameOver();
    }
    if ((ctime - lastpainttime) / 1000 < 1 / frame) {
      return;
    }
    lastpainttime = ctime;
    // handelling score
    document.getElementById("score").innerHTML = score + "/" + birdPassed;

    // moving birds
    birds.forEach((bird, index) => {
      let visual = bird.visual;

      bird.left -= stepDistance + bird.SpeedBias;
      let birdTop = bird.top;
      visual.style.left = bird.left + "px";
      if (bird.left <= -40) {
        if (index > -1) {
          birds.splice(index, 1);
          gamedisplay.removeChild(visual);

          if (birds.length === 0) {
            currentBatch++;
            if (currentBatch < TotalBatch) {
              generateBirds();
            }
          }
        }
      }
    });
  }

  function GameOver() {
    isGameOver = true;
    isGamedrawen = false;
    gameoversound.play();
    gameoverfeel.play();
    gamesound.pause();
    gameOverDialog(score, birdPassed);
  }

  function start() {
    generateBirds();
    // updating window logic starts
    window.requestAnimationFrame(main);
    // TimerID = setInterval(main, 10);
  }

  start();
}

function gameOverDialog(score, total) {
  document.getElementById("gameover").style.display = "flex";
  document.getElementById("finalscore").innerHTML = score + "/" + total;
  let msg = "You missed a lot !";
  if (score / total > 0.8) {
    msg = "Well done !";
  } else if (score / total > 0.5) {
    msg = "you can do better !";
  }
  document.getElementById("msg").innerHTML = msg;
}

// handelling roloading
document.querySelector("#reload").addEventListener("click", (e) => {
  document.querySelector(".gameover").style.display = "none";
  document.getElementById("score").innerHTML = "0/0";
});

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
