'use strict';

const GHOST = '👻';
var gId = 1;
var gGhosts = [];
var gEatenGhosts = [];
var gIntervalGhosts;

function createGhosts(board) {
  gGhosts = [];
  for (var i = 0; i < 3; i++) {
    createGhost(board);
  }

  if (gIntervalGhosts) clearInterval(gIntervalGhosts);
  gIntervalGhosts = setInterval(moveGhosts, 1000);
}

function createGhost(board) {
  // DONE
  const ghost = {
    location: {
      i: 2,
      j: 6,
    },
    currCellContent: FOOD,
    color: getRandomColor(),
    id: gId++,
  };

  gGhosts.push(ghost);
  board[ghost.location.i][ghost.location.j] = GHOST;
}

function moveGhosts() {
  // If all ghosts are eaten --> don't move them
  if (gGhosts.length === 0) return;

  // DONE: loop through ghosts
  for (var i = 0; i < gGhosts.length; i++) {
    const ghost = gGhosts[i];
    moveGhost(ghost);
  }
}

function moveGhost(ghost) {
  if (!gGame.isOn) return;

  const moveDiff = getMoveDiff();
  const nextLocation = {
    i: ghost.location.i + moveDiff.i,
    j: ghost.location.j + moveDiff.j,
  };
  const nextCell = gBoard[nextLocation.i][nextLocation.j];

  // If can't move --> return
  if (nextCell === WALL) {
    renderCell(ghost.location, getGhostHTML(ghost));
    return;
  }

  if (nextCell === GHOST) return;

  // If hitting pacman
  if (nextCell === PACMAN) {
    // If pacman is not is super mode --> game over
    if (!gPacman.isSuper) {
      handleLose();
      return;
    } else {
      return;
    }
  }

  // MOVING FROM
  // Update the model
  gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;

  // Update the DOM
  renderCell(ghost.location, ghost.currCellContent);

  // ADD TO
  // Update the model
  ghost.location = nextLocation;
  ghost.currCellContent = nextCell;
  gBoard[nextLocation.i][nextLocation.j] = GHOST;

  // Update the DOM
  renderCell(ghost.location, getGhostHTML(ghost));
}

function getMoveDiff() {
  const randNum = getRandomIntInclusive(1, 4);

  switch (randNum) {
    case 1:
      return { i: 0, j: 1 };
    case 2:
      return { i: 1, j: 0 };
    case 3:
      return { i: 0, j: -1 };
    case 4:
      return { i: -1, j: 0 };
  }
}

function getGhostHTML(ghost) {
  const color = gPacman.isSuper ? 'blue' : ghost.color;
  const bgcStr = `style="background-color:${color} ;"`;
  return `<span ${bgcStr}>${GHOST}</span>`;
}

// Function that removes ghost by it's location and return it (like splice)
function removeGhostByLocation(pos) {
  for (var i = 0; i < gGhosts.length; i++) {
    const ghost = gGhosts[i];
    const ghostI = ghost.location.i;
    const ghostJ = ghost.location.j;

    if (ghostI === pos.i && ghostJ === pos.j) {
      return gGhosts.splice(i, 1);
    }
  }

  return null;
}
