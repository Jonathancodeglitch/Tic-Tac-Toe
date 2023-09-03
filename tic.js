//create an ai so a player can play with a computer

let cells = document.querySelectorAll('.box');
let modal = document.getElementById('modal');
let modalText = document.querySelector('.display-wins');
let restartButton = document.querySelector('.restart');

const gameBoard = (() => {
  const board = [];
  //check which cell was clicked and add the marker to the particular index in the board array
  const addMarker = (cellValue) => {
    gameController.getCurrentPlayerTurnName() == playerOne.name
      ? (board[cellValue] = 'X')
      : (board[cellValue] = 'O');
  };

  //return our board array throught closure
  const getBoard = () => {
    return board;
  };

  return {
    getBoard,
    addMarker,
  };
})();

//get players names from localstorage;
let playerNames = JSON.parse(localStorage.getItem('playerNames'));

//player object
const player = (name, marker) => {
  let moves = []; // store player moves
  return { name, marker, moves };
};

let playerOne = player(playerNames.playerOne, 'x');
let playerTwo = player(playerNames.playerTwo, 'o');

//game conttroller
//this module contains our logic for our game
const gameController = (() => {
  //variables
  let PlayeroneTurn = true;
  let gameover = false;
  let gameWon = false;
  let board = gameBoard.getBoard();
  let winnerName;
  let winnerMoves;

  //every win condition
  const winCondition = [
    //check rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //check column
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //check diagonal
    [0, 4, 8],
    [6, 4, 2],
  ];
  //switch player turn
  const changePlayerTurn = () => {
    PlayeroneTurn = !PlayeroneTurn;
  };

  // get current player turn
  const getCurrentPlayerTurnName = () => {
    return PlayeroneTurn ? playerOne.name : playerTwo.name;
  };

  // add each players move (what was played by each player) to the moves arr
  //in the player object respectively.
  const updatePlayerMoves = (value) => {
    if (PlayeroneTurn) {
      playerOne.moves.push(Number(value));
    } else {
      playerTwo.moves.push(Number(value));
    }
  };

  //check win
  const checkWin = () => {
    let winnerName;
    //loop through the condition for a win
    //check if any of the win conditon is included in the player moves
    winCondition.forEach((win) => {
      let xWins = win.every((elem) => playerOne.moves.includes(elem));
      let oWins = win.every((elem) => playerTwo.moves.includes(elem));

      //if any is true return the winner
      // and update the winner name and the winners moves with the moves that won
      if (xWins || oWins) {
        //update winner name base on who won
        xWins ? (winnerName = playerOne.name) : (winnerName = playerTwo.name);
        // display the winner
        displayController.displayGameStaus(`The winner is ${winnerName}`);
        //outline the player move that won the game
        outlineWinningCell(win);
        gameWon = true;
        gameover = true;
      }
    });
  };

  // check if cell is empty
  const checkTie = () => {
    if (board.length > 8 && !gameWon) {
      displayController.displayGameStaus(`Draw`);
    }
  };

  //when game is won change the backgroundcolor of the cell that won
  //the game
  const outlineWinningCell = (winningMoves) => {
    winningMoves.forEach((moves) => {
      let winningCell = document.querySelector(`[data-value="${moves}"]`);
      winningCell.style.backgroundColor = '#383737';
    });
  };

  //play round
  const playRound = (cellValue) => {
    //add marker to game board
    gameBoard.addMarker(cellValue);
    updatePlayerMoves(cellValue);
    changePlayerTurn();
    displayController.displayCurrentPlayerTurnName();
    checkTie();
    checkWin();
  };

  //restate game
  const restateGame = () => {
    //clear board
    board.length = 0;
    //set player turn back to default
    PlayeroneTurn = true;
    displayController.displayCurrentPlayerTurnName();
    //clear cells
    cells.forEach((cell) => {
      cell.textContent = '';
      cell.style.backgroundColor = '';
    });
    // clear player previous moves
    playerOne.moves = [];
    playerTwo.moves = [];
    //remove display winner modal if present
    if (modal) modal.classList.remove('open-modal');
  };

  return {
    getCurrentPlayerTurnName,
    restateGame,
    playRound,
  };
})();

//display obj
const displayController = (() => {
  //get game board
  const board = gameBoard.getBoard();
  let currentPlayerDiv = document.getElementById('current-player');

  //display which player turn it currently is.
  const displayCurrentPlayerTurnName = () => {
    let text = `It's ${gameController.getCurrentPlayerTurnName()} Turn`;
    currentPlayerDiv.textContent = text;
  };

  //display when there is a tie or the game was won
  const displayGameStaus = (text) => {
    currentPlayerDiv.textContent = '';
    modal.classList.add('open-modal');
    modalText.textContent = text;
  };

  //display game marker from the board arrays in the cells
  function displayMarkers() {
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  }

  // render to the Dom on click
  const display = (e) => {
    let cell = e.target;
    let cellValue = cell.dataset.value;
    if (cell.textContent == '') {
      gameController.playRound(cellValue);
      displayMarkers();
    }
  };

  return {
    display,
    displayCurrentPlayerTurnName,
    displayMarkers,
    displayGameStaus,
  };
})();

displayController.displayCurrentPlayerTurnName(); // display who's play turn it is..

//event listner
cells.forEach((cell) =>
  cell.addEventListener('click', displayController.display)
);
//restate game when button is click
restartButton.addEventListener('click', gameController.restateGame);
// remove modal and restate game
modal.addEventListener('click', gameController.restateGame);
