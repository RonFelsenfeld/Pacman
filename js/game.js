'use strict';

const WALL = '#';
const FOOD = '.';
const SUPER_FOOD = '🍔';
const CHERRY = '🍒';
const EMPTY = ' ';

// Model
const gGame = {
  score: 0,
  isOn: false,
};

var gBoard;
var gFoodCount;
var gFoodCollected;
var gCherryInterval;

function onInit() {
  updateScore(0);
  gBoard = buildBoard();
  createPacman(gBoard);

  // Getting the total food on board (after creating pacman and before creating ghosts)
  gFoodCount = getFoodOnBoard();
  gFoodCollected = 0;

  createGhosts(gBoard);
  renderBoard(gBoard);

  gCherryInterval = setInterval(addCherry, 15000);
  gGame.isOn = true;

  // moveGhosts()
}

////////////////////////////////////////////////////

// ! Handlers Functions

function handleLose() {
  playLoseSound();
  gameOver();
}

function handleWin() {
  playVictorySound();
  gameOver();
}

function handleFood() {
  updateScore(1);
  gFoodCollected++;
  playFoodSound();
}

function handleSuperFood() {
  gPacman.isSuper = true;
  setTimeout(startSuperTimer, 5000);
  playSpecialSound();
}

function handleCherry() {
  updateScore(10);
  playSpecialSound();
}

function gameOver() {
  clearInterval(gIntervalGhosts);
  renderCell(gPacman.location, '🪦');
  showGameOverModal();
  gGame.isOn = false;
}

function onRestart() {
  hideGameOverModal();
  onInit();
}

////////////////////////////////////////////////////

// ! Helpers Functions

function getEmptyCells() {
  var emptyCells = [];

  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      const currCell = gBoard[i][j];

      if (isEmptyCell(currCell)) emptyCells.push({ i, j });
    }
  }

  return emptyCells;
}

function isEmptyCell(cell) {
  return cell === EMPTY;
}

function isVictory() {
  return gFoodCollected === gFoodCount;
}

function getFoodOnBoard() {
  var foodCount = 0;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      var currCell = gBoard[i][j];
      if (currCell === FOOD) foodCount++;
    }
  }
  return foodCount;
}

////////////////////////////////////////////////////

// ! Sound effects

function playFoodSound() {
  const audio = new Audio('sound/food.wav');
  audio.play();
}

function playSpecialSound() {
  const audio = new Audio('sound/special-food.wav');
  audio.play();
}

function playEatGhostSound() {
  const audio = new Audio('sound/ghost.wav');
  audio.play();
}

function playVictorySound() {
  const audio = new Audio('sound/win.wav');
  audio.play();
}

function playLoseSound() {
  const audio = new Audio('sound/lose.wav');
  audio.play();
}

////////////////////////////////////////////////////

// ! Adding/Showing or Removing Elements

function showGameOverModal() {
  const elGameOver = document.querySelector('.modal-overlay');
  elGameOver.classList.remove('hide');

  if (isVictory()) {
    const elWinGreet = document.querySelector('.win-title');
    elWinGreet.classList.remove('hide');
  }
}

function hideGameOverModal() {
  const elGameOver = document.querySelector('.modal-overlay');
  elGameOver.classList.add('hide');

  const elWinGreet = document.querySelector('.win-title');
  elWinGreet.classList.add('hide');
}

function addCherry() {
  const emptyCells = getEmptyCells();
  if (emptyCells.length === 0) return;
  const rndInx = getRandomIntInclusive(0, emptyCells.length - 1);
  const rndCell = emptyCells[rndInx];

  // Update model
  gBoard[rndCell.i][rndCell.j] = CHERRY;

  // Update DOM
  renderCell(rndCell, CHERRY);
}

////////////////////////////////////////////////////

// In class
function buildBoard() {
  const size = 10;
  const board = [];

  for (var i = 0; i < size; i++) {
    board.push([]);

    for (var j = 0; j < size; j++) {
      board[i][j] = FOOD;

      if (
        i === 0 ||
        i === size - 1 ||
        j === 0 ||
        j === size - 1 ||
        (j === 3 && i > 4 && i < size - 2)
      ) {
        board[i][j] = WALL;
      }

      if (
        (i === 1 && j === 1) ||
        (i === 1 && j === size - 2) ||
        (i === size - 2 && j === 1) ||
        (i === size - 2 && j === size - 2)
      ) {
        board[i][j] = SUPER_FOOD;
      }
    }
  }

  return board;
}

function renderBoard(board) {
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      const cell = board[i][j];
      const className = `cell cell-${i}-${j}`;

      strHTML += `<td class="${className}">${cell}</td>`;
    }
    strHTML += '</tr>';
  }
  const elContainer = document.querySelector('.board');
  elContainer.innerHTML = strHTML;
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function updateScore(diff) {
  // DONE: update model and dom
  if (!diff) {
    gGame.score = 0;
  } else {
    gGame.score += diff;
  }
  document.querySelector('span.score').innerText = gGame.score;
}
