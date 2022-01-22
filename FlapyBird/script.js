let rules = false;
const movesound = new Audio("../audio/audio2.wav");
const gameoversound = new Audio("../audio/funnyGameover.wav");
const gamesound = new Audio("../audio/spacesound.mp3");
gameoversound.volume = 0.7;
gamesound.volume = 0.5;
gamesound.loop = true;
let isGamedrawen = false;

document.addEventListener("DOMContentLoaded", () => {
  if (!isGamedrawen) {
    gameEngine();
  }
});

// gameEngine
function gameEngine() {
  const gameDisplay = document.querySelector(".game-container");
  gameDisplay.innerHTML = "";
  // generating sky
  const skyDisplay = document.createElement("div");
  skyDisplay.classList.add("sky");
  gameDisplay.appendChild(skyDisplay);

  // generating ground
  const ground = document.createElement("div");
  ground.classList.add("ground");
  gameDisplay.appendChild(ground);

  // generating bird
  const bird = document.createElement("div");
  bird.classList.add("bird");
  skyDisplay.appendChild(bird);

  let birdLeft = 220;
  let birdBottom = 100;
  let isGameOver = false;
  let isGameStarted = false;
  let gravity = 3;
  let gap = 550;
  let score = 0;
  let firstjump = true;
  document.getElementById("score").innerHTML = score;

  let gameTimerId;

  function startGame() {
    if (birdBottom > 0) {
      birdBottom -= gravity;
      bird.style.bottom = birdBottom + "px";
      bird.style.left = birdLeft + "px";
    }
  }

  function control(e) {
    if (e.key === "ArrowUp") {
      if (firstjump) {
        jump(200);
        firstjump = false;
      }
      jump();
    }
  }

  function jump(jump_height = 100) {
    if (birdBottom < 500) {
      movesound.play();
      birdBottom += jump_height;
      bird.style.bottom = birdBottom + "px";
    } else {
      console.log("game over");
      gameOver();
    }
    if (!isGameStarted) {
      isGameStarted = true;
      document.querySelector(".enter").style.display = "none";
      generateObstacle();
    }
  }
  document.addEventListener("keyup", control);
  gameDisplay.addEventListener("click", () => {
    if (firstjump) {
      jump(200);
      firstjump = false;
    }
    jump();
  });

  function generateObstacle() {
    let obstacleLeft = 500;
    let randomHeight = Math.random() * 150;
    let obstacleBottom = randomHeight;
    const obstacle = document.createElement("div");
    const topobstacle = document.createElement("div");
    if (!isGameOver) {
      obstacle.classList.add("obstacle");
      topobstacle.classList.add("topobstacle");
      gameDisplay.appendChild(obstacle);
      gameDisplay.appendChild(topobstacle);
      obstacle.style.left = obstacleLeft + "px";
      topobstacle.style.left = obstacleLeft - 50 + "px";
      obstacle.style.bottom = obstacleBottom + "px";
      topobstacle.style.bottom = obstacleBottom + gap + "px";
    }

    function moveObstacle() {
      if (obstacleLeft <= -80) {
        clearInterval(timerId);
        gameDisplay.removeChild(obstacle);
        gameDisplay.removeChild(topobstacle);

        if (!isGameOver) {
          score++;
          document.getElementById("score").innerHTML = score + 1;
        }
      }
      obstacleLeft -= 2;
      obstacle.style.left = obstacleLeft + "px";
      topobstacle.style.left = obstacleLeft - 50 + "px";

      if (
        (obstacleLeft > 180 &&
          obstacleLeft < 260 &&
          birdLeft === 220 &&
          (birdBottom + 150 < obstacleBottom + 300 ||
            birdBottom > obstacleBottom + gap - 200)) ||
        birdBottom <= 0
      ) {
        gameOver();
        if (isGameOver) clearInterval(timerId);
      }
    }

    let timerId = setInterval(moveObstacle, 20);
    if (!isGameOver) setTimeout(generateObstacle, 3000);
    if (isGameOver) clearInterval(timerId);
  }

  function gameOver() {
    gameoversound.play();
    clearInterval(gameTimerId);
    console.log("game over");
    isGameOver = true;
    isGamedrawen = false;
    document.querySelector(".gameover").style.display = "flex";
    document.getElementById("finalscore").innerHTML = score;
    document.removeEventListener("keyup", control);
  }

  function start() {
    isGamedrawen = true;
    gameTimerId = setInterval(startGame, 20);
    // generateObstacle();
  }

  start();
}

// handelling roloading
document.querySelector("#reload").addEventListener("click", (e) => {
  document.querySelector(".gameover").style.display = "none";
  document.querySelector(".game-container").innerHTML = "";
  gameEngine();
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

    document.getElementById("rules").style.display = "flex";
    document.getElementById("rules-btn").style.color = "tomato";
    document.getElementById("rules").style.width = "350px";
    document.getElementById("rules").style.height = "500px";
    document.getElementById("rules").style.padding = "20px";
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
