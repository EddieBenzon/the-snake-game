const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

//setup vars
let speed = 7;
let tileCount = 20;
let tileSize = canvas.width / tileCount;
let headX = 10;
let headY = 10;

let appleX = 5;
let appleY = 5;

let newAppleX = 0;
let newAppleY = 0;

let inputsXVelocity = 0;
let inputsYVelocity = 0;

let previousXVelocity = 0;
let previousYVelocity = 0;

let xVelocity = 0;
let yVelocity = 0;
let score = 0;

let scoreElement = document.getElementById("score");
let highscoreElement = document.getElementById("highscore");

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
let winCondition = false;
const snakeTail = [];
let tailLength = 2;

//main game loop function
function drawGame() {
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;

  // moving from right to left
  if (previousXVelocity === 1 && xVelocity === -1) {
    xVelocity = previousXVelocity;
  }
  // moving from left to right
  if (previousXVelocity === -1 && xVelocity === 1) {
    xVelocity = previousXVelocity;
  }
  // moving from up to down
  if (previousYVelocity === -1 && yVelocity === 1) {
    yVelocity = previousYVelocity;
  }
  // moving from down to up
  if (previousYVelocity === 1 && yVelocity === -1) {
    yVelocity = previousYVelocity;
  }
  previousXVelocity = xVelocity;
  previousYVelocity = yVelocity;

  changeSnakePosition();
  let result = isGameOver();
  if (winCondition === true) {
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";
    ctx.fillText("You Win!", canvas.width / 6.5, canvas.height / 2);
    if (confirm("Congratulations! You Win!") === true) {
      location.reload();
    } else return;
  }
  if (result) {
    if (confirm("Game Over! Try again?") === true) {
      location.reload();
    } else return;
  }
  clearScreen();
  drawSnake();
  drawApple();
  checkAppleCollision();

  if (score > 700) {
    speed = 7.5;
  }

  if (score > 1400) {
    speed = 8;
  }
  if (score > 3000) {
    speed = 8.5;
  }
  if (score > 4000) {
    speed = 9;
  }
  if (score > 5000) {
    speed = 9.5;
  }
  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  for (let i = 0; i < snakeTail.length; i++) {
    let part = snakeTail[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";
    ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);
  }

  return gameOver;
}

//create gradient
var grd = ctx.createLinearGradient(0, 0, 0, 200);
grd.addColorStop(0, "rgb(23, 88, 23)");
grd.addColorStop(1, "rgb(11, 43, 11)");

function clearScreen() {
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "rgb(0, 209, 0)";
  for (let i = 0; i < snakeTail.length; i++) {
    let part = snakeTail[i];
    ctx.fillRect(
      part.x * tileCount,
      part.y * tileCount,
      tileSize - 1,
      tileSize - 1
    );
  }
  snakeTail.push(new SnakePart(headX, headY));
  if (snakeTail.length > tailLength) {
    snakeTail.shift();
  }

  ctx.fillStyle = "rgb(0, 240, 0)";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function drawApple() {
  ctx.fillStyle = "rgb(219, 255, 219)";
  ctx.fillRect(appleX * tileSize, appleY * tileSize, tileSize, tileSize);
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    generateApplePosition();
    tailLength++;
    score += 100;
    scoreElement.innerHTML = score;
  }
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function generateApplePosition() {
  // Count how many tiles are left for spawning in
  const tilesLeft = tileCount * tileCount - snakeTail.length;
  let collisionDetect;

  if (tilesLeft > 0) {
    do {
      const newAppleX = Math.floor(Math.random() * tileCount);
      const newAppleY = Math.floor(Math.random() * tileCount);
      collisionDetect = false;

      for (let i = 0; i < snakeTail.length; i++) {
        const { x, y } = snakeTail[i];
        if (newAppleX === x && newAppleY === y) {
          collisionDetect = true; // Collision
          break;
        }
      }
      if (tilesLeft === 0) {
        winCondition = true;
        break;
      }

      if (!collisionDetect) {
        // Found spawn point
        appleX = newAppleX;
        appleY = newAppleY;
      }
    } while (collisionDetect);
  }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  //up
  if (event.keyCode == 38) {
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }
  //down
  if (event.keyCode == 40) {
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }
  //left
  if (event.keyCode == 37) {
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }
  //right
  if (event.keyCode == 39) {
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}

drawGame();
