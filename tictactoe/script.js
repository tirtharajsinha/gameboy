player = ["", "", "", "", "", "", "", "", ""]; // x
default_board = ["", "", "", "", "", "", "", "", ""]; // default
current_player = "X";
totalfree = 9;
winner_not_decided = true;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

var audio1 = new Audio("../audio/audio1.wav");
var audio2 = new Audio("../audio/audio2.wav");
var audio3 = new Audio("../audio/audio3.wav");
var audio4 = new Audio("../audio/audio4.wav");
var audio5 = new Audio("../audio/audio5.wav");
setTimeout(() => {
  audio3.play();
}, 200);

document.querySelectorAll(".row div").forEach((element) => {
  element.addEventListener("click", (event) => {
    if (current_player == "X") {
      audio1.play();
    } else {
      audio2.play();
    }
    data = event.target.getAttribute("cell-data");
    if (player[data - 1] == "" && winner_not_decided) {
      event.target.innerHTML = current_player;
      event.target.style.color = "rgb(3, 78, 143)";
      if (current_player == "X") {
        player[data - 1] = "X";
        current_player = "O";
        document.querySelector("body h3").innerHTML = "<br>It is O's turn.";
      } else {
        player[data - 1] = "O";
        current_player = "X";
        document.querySelector("body h3").innerHTML = "<br>It is X's turn.";
      }
      if (winner_not_decided) {
        checkwinner();
      }
      totalfree -= 1;
      if (totalfree == 0 && winner_not_decided) {
        winner_not_decided = false;
        audio5.play();
        document.querySelector("body h3").innerHTML =
          "It's a draw.<br>Thank You for spending time with us";
      }

      console.log(player);
    }
  });
});

function checkwinner() {
  let roundWon = false;
  for (let i in winningConditions) {
    const winCondition = winningConditions[i];
    let a = player[winCondition[0]];
    let b = player[winCondition[1]];
    let c = player[winCondition[2]];
    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      winner_not_decided = false;
      audio4.play();
      break;
    }
  }
  if (roundWon) {
    startConfetti();
    setTimeout(() => {
      stopConfetti();
    }, 3000);
    if (current_player == "X") {
      document.querySelector("body h3").innerHTML =
        "Congratulations!<br>O is the winner";
    } else {
      document.querySelector("body h3").innerHTML =
        "Congratulations!<br>X is the winner";
    }
    gameActive = false;
    return;
  }
}

document.querySelector(".refresh").addEventListener("click", (event) => {
  document.querySelectorAll(".row div").forEach((element) => {
    element.innerHTML = "";
  });
  player = ["", "", "", "", "", "", "", "", ""];
  current_player = "X";
  totalfree = 9;
  winner_not_decided = true;
  document.querySelector("body h3").innerHTML = "It is X's turn.";
  audio3.play();
});

if (document.body.clientWidth < 600) {
  var maxParticleCount = 50;
  console.log("he");
}
