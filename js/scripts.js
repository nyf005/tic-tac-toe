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
  let _gameboard = [];

  const setSquare = (index, player) => {
    if (index < 1 || index > 9) return;
  };

  const resetGameBoard = () => {};

  return { setSquare, resetGameBoard };
})();

const displayController = (() => {
  // Get display elements
  const _squares = document.querySelectorAll(".square");
  const _message = document.querySelector("#message p");

  // Display who's turn it is
  const showTurn = (player) => {
    _message.textContent = `Player ${player.getSymbol()}'s turn`;
  };

  const showSymbol = (player) => {};

  return { showTurn, showSymbol };
})();

const gameController = (() => {
  const _playerX = Player("X");
  const _playerO = Player("O");

  displayController.showTurn(_playerO);
})();
