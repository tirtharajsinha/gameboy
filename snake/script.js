// game variables
let inputDir = { x: -1, y: 0 };
const foodsound = new Audio("../audio/eating.wav");
const gameoversound = new Audio("../audio/bomb.wav");
const gameoversound2 = new Audio("../audio/audio5.wav");
const movesound = new Audio("../audio/audio1.wav");
const musicsound = new Audio("../audio/audio3.wav");
musicsound.volume = 0.2;
let speed = 5;
let lastpainttime = 0;
let snakeArr = [
  { x: 13, y: 15 },
  { x: 14, y: 15 },
];
let board = document.getElementById("board");
let food = { x: 5, y: 6 };
let nowkey = "left";
let gamestart = false;
let score = 0;
let levelup = 0;
let level = 1;
let highscoreval = 0;
let rules = false;

let highscore = localStorage.getItem("snakehighscore");
if (highscore == null) {
  highscoreval = 0;
  localStorage.setItem("highscore", JSON.stringify(highscoreval));
} else {
  highscoreval = parseInt(highscore);
}

setTimeout(() => {
  document.getElementById("rules-btn").click();
}, 1000);
setTimeout(() => {
  if (rules) {
    document.getElementById("rules-btn").click();
  }
}, 10000);

function main(ctime) {
  window.requestAnimationFrame(main);

  // controlling the fps
  if ((ctime - lastpainttime) / 1000 < 1 / speed) {
    return;
  }
  lastpainttime = ctime;

  gameEngine();
}

function gameEngine() {
  // if snake head touch wall or its body
  if (ifcolide(snakeArr)) {
    musicsound.pause();

    inputDir = { x: -1, y: 0 };
    gameover(score);
    snakeArr = [
      { x: 13, y: 15 },
      { x: 14, y: 15 },
    ];
    score = 0;
    nowkey = "left";
    gamestart = false;
    levelup = 0;
    level = 1;
  }

  // moving the snake

  if (gamestart) {
    for (let i = snakeArr.length - 2; i >= 0; i--) {
      const element = snakeArr[i];
      snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;
  }

  // regenarate the food when you eat food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    console.log("eaten");
    foodsound.play();
    score++; // increasing the score
    if (score > highscoreval) {
      highscoreval = score;
      localStorage.setItem("snakehighscore", JSON.stringify(highscoreval));
    }

    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    let a = 2;
    let b = 18;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
  }
  // display the updated snake array
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;

    if (index === 0) {
      snakeElement.classList.add("head");
      snakeElement.innerHTML = "<img src='snakehead.png' alt=''>";
      switch (nowkey) {
        case "up":
          snakeElement.style.transform = "rotate(90deg)";
          break;
        case "down":
          snakeElement.style.transform = "rotate(-90deg)";
          break;
        case "left":
          snakeElement.style.transform = "rotate(0deg)";
          break;
        case "right":
          snakeElement.style.transform = "rotate(180deg)";
          break;
        default:
          break;
      }
    } else if (index == snakeArr.length - 1) {
      snakeElement.classList.add("tail");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  // display food
  foodElement = document.createElement("div");
  foodElement.innerHTML = "<img src='apple.png' alt=''>";
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");

  board.appendChild(foodElement);

  // display score, Highscore and level
  document.getElementById("hscore").innerHTML = highscoreval;
  document.getElementById("score").innerHTML = score;
  document.getElementById("level").innerHTML = level;
  if (score % 10 == 0 && score > 0) {
    if (levelup != score) {
      speed++;
      console.log("leveling up");
      levelup = score;
      level++;
    }
  }
}

function ifcolide(sarr) {
  for (let i = 1; i < snakeArr.length; i++) {
    if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
      gameoversound2.play();
      return true;
    }
  }
  if (
    snakeArr[0].x <= 0 ||
    snakeArr[0].x >= 20 ||
    snakeArr[0].y <= 0 ||
    snakeArr[0].y >= 20
  ) {
    gameoversound.play();
    return true;
  }
  return false;
}

function gameover(nowscore) {
  document.getElementById("gameover").style.display = "flex";
  document.getElementById("finalscore").innerHTML = nowscore;
}

// core logic starts
window.requestAnimationFrame(main);

document.getElementById("reload").addEventListener("click", (e) => {
  document.getElementById("gameover").style.display = "none";
});

window.addEventListener("keydown", (e) => {
  inputDir = { x: -1, y: 0 };
  movesound.play();

  switch (e.key) {
    case "ArrowUp":
      console.log("arrowup");
      inputDir.x = 0;
      inputDir.y = -1;
      nowkey = "up";
      break;
    case "ArrowDown":
      console.log("arrowDown");
      inputDir.x = 0;
      inputDir.y = 1;
      nowkey = "down";

      break;
    case "ArrowLeft":
      console.log("arrowLeft");
      inputDir.x = -1;
      inputDir.y = 0;
      nowkey = "left";

      break;
    case "ArrowRight":
      console.log("arrowRight");
      inputDir.x = 1;
      inputDir.y = 0;
      nowkey = "right";
      break;
    case "Enter":
      if (gamestart == false) {
        musicsound.play();
        gamestart = true;
      } else if (gamestart == true) {
        musicsound.pause();
        gamestart = false;
      }
      console.log("enter");
      break;
    default:
      break;
  }
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
    document.getElementById("rules").style.height = "550px";
    document.getElementById("rules").style.padding = "20px";
    setTimeout(() => {
      document.querySelector("#rules h5").style.opacity = "1";
      document.querySelector("#rules ul").style.opacity = "1";
    }, 420);
  }
});

if (
  document.body.clientWidth < 550 ||
  document.documentElement.clientWidth < 550
) {
  document.querySelector(".poster").style.display = "flex";
}
