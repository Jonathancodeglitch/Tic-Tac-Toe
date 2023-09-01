//create an ai so a player can play with a computer

let cells = document.querySelectorAll('.box');
let modal = document.getElementById('modal');
let modalText = document.querySelector('.display-wins');
let restartButton = document.querySelector('.restart');

const gameBoard = (() => {
  const board = [];
  //check which cell was clicked and add the marker to the particular index in the board array
  const addMarker = (cellValue) => {
    gameController.getCurrentPlayerTurn() == playerOne.name
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
const gameController = (() => {
  let PlayerOneTurn = true;
  let board = gameBoard.getBoard();
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
    PlayerOneTurn = !PlayerOneTurn;
  };

  // get current player turn
  const getCurrentPlayerTurn = () => {
    return PlayerOneTurn ? playerOne.name : playerTwo.name;
  };

  // add each players move (what was played by each player) to the moves arr
  //in the player object respectively.

  const updatePlayerMoves = (value) => {
    if (PlayerOneTurn) {
      playerOne.moves.push(Number(value));
    } else {
      playerTwo.moves.push(Number(value));
    }
  };

  //check win
  const checkWin = () => {
    let winnerName;
    let winnerMoves;
    //loop through the condition for a win
    //check if any of the win conditon is included in the player moves
    winCondition.forEach((win) => {
      let xWins = win.every((elem) => playerOne.moves.includes(elem));
      let oWins = win.every((elem) => playerTwo.moves.includes(elem));

      //if any is true return the winner
      // and update the winner name and the winners moves with the moves that won
      if (xWins) {
        winnerName = playerOne.name;
        winnerMoves = win;
      } else if (oWins) {
        winnerName = playerTwo.name;
        winnerMoves = win;
      }
    });

    return [winnerName, winnerMoves];
  };

  // check if cell is empty
  const checkForEmptyCell = () => {
    let isCellEmpty = true;
    cells.forEach((cell) => {
      if (cell.textContent === '') {
        isCellEmpty = false;
      }
    });
    return isCellEmpty;
  };

  //play round
  const playRound = (cellValue) => {
    gameBoard.addMarker(cellValue);
    updatePlayerMoves(cellValue);
    changePlayerTurn();
  };

  //restate game
  const restateGame = () => {
    //clear board
    board.length = 0;
    //set player turn back to default
    PlayerOneTurn = true;
    displayController.displayCurrentPlayerName();
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
    getCurrentPlayerTurn,
    checkWin,
    checkForEmptyCell,
    restateGame,
    playRound,
  };
})();

//display obj
const displayController = (() => {
  //get game board
  const board = gameBoard.getBoard();
  const currentPlayer = document.getElementById('current-player');

  //display which player turn it currently is.
  const displayCurrentPlayerName = () => {
    let text = `It's ${gameController.getCurrentPlayerTurn()} Turn`;
    currentPlayer.textContent = text;
  };

  const displayWinner = () => {
    const [winnerName, winnerMoves] = gameController.checkWin();
    //check for draw
    if (gameController.checkForEmptyCell() && !winnerName) {
      modal.classList.add('open-modal');
      modalText.textContent = `DRAW!!`;
      //remove currentPlayerName
      currentPlayer.textContent = '';
    } else if (winnerName) {
      // check for a win
      modal.classList.add('open-modal');
      modalText.textContent = `The winner is ${winnerName}`;
      //outline winner moves
      winnerMoves.forEach((moves) => {
        let cell = document.querySelector(`[data-value="${moves}"]`);
        cell.style.backgroundColor = '#383737';
      });
      //remove currentPlayerName
      currentPlayer.textContent = '';
    }
  };

  //display game marker from the board arrays in the cells
  function displayMarker() {
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
      displayMarker();
      displayCurrentPlayerName();
      displayWinner();
    }
  };

  return { display, displayCurrentPlayerName, displayMarker };
})();

displayController.displayCurrentPlayerName(); // display who's play turn it is..

//event listner
cells.forEach((cell) => cell.addEventListener('click', displayController.display));
//restate game when button is click
restartButton.addEventListener('click', gameController.restateGame);
// remove modal and restate game
modal.addEventListener('click', gameController.restateGame);
