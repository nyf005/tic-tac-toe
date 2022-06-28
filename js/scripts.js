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

  const setSquare = (index, symbol) => {
    if (index < 1 || index > 9) return;
  };

  const resetGameBoard = () => {};

  return { setSquare, resetGameBoard };
})();
