// Rule of thumb:
// if you only ever need ONE of something (gameBoard, displayController), use a module.
// If you need multiples of something (players!), create them with factories.

const Player = (symbol) => {
  let _playerSymbol = symbol;

  const getSymbol = () => {
    return _playerSymbol;
  };

  return { getSymbol };
};

const gameBoard = (() => {
  // odd number for pX and even number for pO
  let _gameboard = [];

  // Add index of square chosen by player to array
  const setChoice = (index) => {
    if (!(index > 0 && index < 10) || _gameboard.includes(index)) return;
    _gameboard.push(index);
  };

  const resetGameBoard = () => {};

  return { setChoice, resetGameBoard };
})();

const displayController = (() => {
  // Get display elements
  const _message = document.querySelector("#message p");

  // Display who's turn it is
  const showTurn = (player) => {
    _message.textContent = `Player ${player.getSymbol().toUpperCase()}'s turn`;
  };

  //
  const addSymbolToBoard = (square, player) => {
    if (square.textContent != "") return;
    square.textContent = player.getSymbol();
    square.style.backgroundColor =
      player.getSymbol() == "x" ? "#ffc200" : "#fa5c0c";
  };

  return { showTurn, addSymbolToBoard };
})();

const gameController = (() => {
  const _squares = document.querySelectorAll(".square");
  const _winningCOnditions = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];
  const _playerX = Player("x");
  const _playerO = Player("o");

  displayController.showTurn(_playerX);

  _squares.forEach((square) => {
    square.addEventListener("click", () => {
      let index = square.getAttribute("data-index");
      gameBoard.setChoice(index);
      displayController.addSymbolToBoard(square, _playerO);
    });
  });
})();
