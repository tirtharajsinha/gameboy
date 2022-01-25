import Ball from "./ball.js";
import Paddle from "./paddle.js";

const misssound = new Audio("../audio/audio1.wav");
let isGameStarted = false;
let rules = false;
const board = document.querySelector(".board");
const ball = new Ball(document.getElementById("ball"), board);
const playerPaddle = new Paddle(document.getElementById("player-paddle"));
const computerPaddle = new Paddle(document.getElementById("computer-paddle"));
const playerscoreElement = document.getElementById("player-score");
const computerscoreElement = document.getElementById("computer-score");

document.addEventListener("DOMContentLoaded", function () {
  board.addEventListener("click", () => {
    if (!isGameStarted) {
      isGameStarted = true;
      document.querySelector(".enter").style.display = "none";
      gameEngine();
    } else if (isGameStarted) {
      isGameStarted = false;
    }
  });
  board.addEventListener("dblclick", () => {
    isGameStarted = false;
    ball.reset();
    computerPaddle.reset();
    gameOverDialog(
      parseInt(playerscoreElement.textContent),
      parseInt(computerscoreElement.textContent)
    );
    computerscoreElement.textContent = 0;
    playerscoreElement.textContent = 0;
  });
});

function gameEngine() {
  let lastTime;
  function update(time) {
    if (isGameStarted) {
      if (lastTime != null) {
        const delta = time - lastTime;
        ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()]);
        // console.log(ball.y);
        computerPaddle.update(delta, ball.y);

        if (isLose()) {
          misssound.play();
          handleLose();
        }
      }
      lastTime = time;
      window.requestAnimationFrame(update);
    }
  }

  function isLose() {
    const rect = ball.rect();
    const rectofboard = ball.rectofboard;
    return rect.right >= rectofboard.right || rect.left <= rectofboard.left;
  }

  function handleLose() {
    const rect = ball.rect();
    const rectofboard = ball.rectofboard;
    if (rect.right >= rectofboard.right) {
      playerscoreElement.textContent =
        parseInt(playerscoreElement.textContent) + 1;
    } else {
      computerscoreElement.textContent =
        parseInt(computerscoreElement.textContent) + 1;
    }
    ball.reset();
    computerPaddle.reset();
  }

  board.addEventListener("mousemove", (e) => {
    playerPaddle.position = (e.offsetY / board.clientHeight) * 100;
    //   computerPaddle.position = (e.offsetY / board.clientHeight) * 100;
  });
  // board.addEventListener("mouseleave", (e) => {
  //   playerPaddle.position = 50;
  // });

  window.requestAnimationFrame(update);
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

function gameOverDialog(score1, score2) {
  document.getElementById("gameover").style.display = "flex";
  document.getElementById("finalscore").innerHTML = score1 + "|" + score2;
  let msg = "You Win !";
  if (score2 < score1) {
    msg = "Computer Win !";
  } else if (score1 === score2) {
    msg = "MAtch Draw";
  }
  document.getElementById("msg").innerHTML = msg;
}
document.querySelector("#reload").addEventListener("click", (e) => {
  document.querySelector(".gameover").style.display = "none";
});
