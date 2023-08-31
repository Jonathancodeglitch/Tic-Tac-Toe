//player should be able to click on the board and display there marker
//display which person turn it is currently
// build a logic that can check if the game is over , if a player won , if its a tie
// add a button to start and restart the game
// add a display element that displays won,if the game is a tie
//create an ai so a player can play with a computer

let cells = document.querySelectorAll('.box');

let modal = document.getElementById('modal');
let modalText = document.querySelector('.display-wins');
let restartButton = document.querySelector('.restart');

const gameBoard = (() => {
  const board = [];

  const addMarker = (cellValue) => {
    gameController.getCurrentPlayerTurn() == playerOne.name
      ? (board[cellValue] = 'X')
      : (board[cellValue] = 'O');
  };

  const getBoard = () => {
    return board;
  };

  const winCondition = () => {
    return [
      //check rows
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      //check column
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      //check diagonal
      [1, 5, 9],
      [3, 5, 7],
    ];
  };

  return {
    getBoard,
    addMarker,
    winCondition,
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

  const changePlayerTurn = () => {
    PlayerOneTurn = !PlayerOneTurn;
  };

  const getCurrentPlayerTurn = () => {
    return PlayerOneTurn ? playerOne.name : playerTwo.name;
  };

  const updatePlayerMoves = (value) => {
    if (PlayerOneTurn) {
      playerOne.moves.push(Number(value));
    } else {
      playerTwo.moves.push(Number(value));
    }
  };

  //check win
  const checkWin = () => {
    let winCondition = gameBoard.winCondition();
    let winnerName;
    let winnerMoves;

    winCondition.forEach((win) => {
      let xWins = win.every((elem) => playerOne.moves.includes(elem));

      let oWins = win.every((elem) => playerTwo.moves.includes(elem));

      if (xWins) {
        winnerName = playerOne.name;
        winnerMoves = win;
      } else if (oWins) {
        winnerName = playerTwo.name;
        winnerMoves = win;
      }
    });
    //continue from here
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
    changePlayerTurn();
    updatePlayerMoves(cellValue);
  };
  //restate game
  const restateGame = () => {
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
  const board = gameBoard.getBoard();
  // let count = 0;
  const currentPlayer = document.getElementById('current-player');

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

  const displayMarker = (e) => {
    let cell = e.target;
    let cellValue = cell.dataset.value;

    if (cell.textContent == '') {
      //update gamboard with x or o
      cell.textContent = `${
        gameController.getCurrentPlayerTurn() == playerOne.name ? 'X' : 'O'
      }`;

      gameController.playRound(cellValue);
      displayCurrentPlayerName();
      displayWinner();

      console.log(board);
    }
  };

  return { displayMarker, displayCurrentPlayerName };
})();

displayController.displayCurrentPlayerName(); // display who's play turn it is..

//event listner
cells.forEach((cell) => {
  cell.addEventListener('click', displayController.displayMarker);
});

//restate game when button is click
restartButton.addEventListener('click', gameController.restateGame);
// remove modal and restate game
modal.addEventListener('click', gameController.restateGame);
