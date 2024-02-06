'use strict';

const DOWN = 'down';
const UP = 'up';
const LEFT = 'left';
const RIGHT = 'right';

// The pacman has changed to var because I'm changing it based on direction
var PACMAN =
  '<img src="img/pacman.png" alt="pacman" class="pacman face-right" />';
var gPacman;

function createPacman(board) {
  // DONE: initialize gPacman...
  gPacman = {
    location: {
      i: 2,
      j: 2,
    },
    isSuper: false,
  };
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function onMovePacman(ev) {
  if (!gGame.isOn) return;
  // DONE: use getNextLocation(), nextCell
  const nextLocation = getNextLocation(ev.key);
  const nextCell = gBoard[nextLocation.i][nextLocation.j];

  // DONE: return if cannot move
  if (nextCell === WALL) return;

  // If next cell is super food and pacman already in super
  if (nextCell === SUPER_FOOD && gPacman.isSuper) return;

  // Hitting a ghost handling
  if (nextCell === GHOST) {
    // If pacman is not is super mode --> game over
    if (!gPacman.isSuper) {
      handleLose();
      return;
    } else {
      // Pacman in super mode
      const deadGhost = removeGhostByLocation(nextLocation); // ! See the function implementation
      gEatenGhosts.push(deadGhost[0]);
      playEatGhostSound();
    }
  }

  if (nextCell === FOOD) {
    handleFood();
  }

  // Handling the super mood
  if (nextCell === SUPER_FOOD) {
    handleSuperFood();
  }

  if (nextCell === CHERRY) {
    handleCherry();
  }

  // MOVING FROM
  // Update the model
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;

  // Update the DOM
  renderCell(gPacman.location, EMPTY);

  // ADDING TO
  // Update the model
  gPacman.location = nextLocation;
  gBoard[nextLocation.i][nextLocation.j] = PACMAN;

  // Update the DOM
  renderCell(nextLocation, PACMAN);

  if (isVictory()) {
    handleWin();
  }
}

function getNextLocation(eventKeyboard) {
  const nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j,
  };
  switch (eventKeyboard) {
    case 'ArrowUp':
      changeDirection(UP);
      nextLocation.i--;
      break;
    case 'ArrowRight':
      changeDirection(RIGHT);
      nextLocation.j++;
      break;
    case 'ArrowDown':
      changeDirection(DOWN);
      nextLocation.i++;
      break;
    case 'ArrowLeft':
      changeDirection(LEFT);
      nextLocation.j--;
      break;
  }
  return nextLocation;
}

function startSuperTimer() {
  gPacman.isSuper = false;
  gGhosts = [...gGhosts, ...gEatenGhosts];
  gEatenGhosts = [];
}

function changeDirection(direction) {
  PACMAN = `<img src="img/pacman.png" alt="pacman" class="pacman face-${direction}" />`;
}
