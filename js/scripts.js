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
