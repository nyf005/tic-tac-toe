// Rule of thumb:
// if you only ever need ONE of something (gameBoard, displayController), use a module.
// If you need multiples of something (players!), create them with factories.

const Player = (symbol) => {
  let _playerSymbol = symbol;
  let _choices = [];

  const getSymbol = () => {
    return _playerSymbol;
  };

  const addChoice = (choice) => {
    _choices.push(Number(choice));
  };

  const getChoices = () => {
    return _choices;
  };

  return { getSymbol, getChoices, addChoice };
};

const gameBoard = (() => {
  // odd number for pX and even number for pO
  let _gameboard = [];

  // Add index of square chosen by player to array
  const setChoice = (index, player) => {
    if (!(index > 0 && index < 10) || _gameboard.includes(index)) return;
    _gameboard.push(index);
    player.addChoice(index);
  };

  const getGbLength = () => {
    return _gameboard.length;
  };

  const resetGameBoard = () => {};

  return { setChoice, resetGameBoard, getGbLength };
})();

const displayController = (() => {
  // Get display elements
  const _message = document.querySelector("#message p");

  // Display who's turn it is
  const showTurn = (player) => {
    _message.textContent = `Player ${player.getSymbol().toUpperCase()}'s turn`;
  };

  const displayWinner = (player) => {
    _message.textContent = `Player ${player.getSymbol().toUpperCase()} wins`;
  };

  //
  const addSymbolToBoard = (square, player) => {
    if (square.textContent != "") return;
    player.getSymbol() == "x"
      ? square.classList.add("player-x")
      : square.classList.add("player-o");
    square.textContent = player.getSymbol();
  };

  return { showTurn, addSymbolToBoard, displayWinner };
})();

const gameController = (() => {
  const _squares = document.querySelectorAll(".square");
  const _winningConditions = [
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
  let _currentPlayer = _playerX;
  let _pChoices;
  let _winner = false;

  displayController.showTurn(_currentPlayer);

  _squares.forEach((square) => {
    square.addEventListener("click", () => {
      let index = square.getAttribute("data-index");
      gameBoard.setChoice(index, _currentPlayer);
      displayController.addSymbolToBoard(square, _currentPlayer);

      // Retrieve the updated array of current player choices
      _pChoices = _currentPlayer.getChoices();

      // Check if there is a winner
      _winningConditions.forEach((condition) => {
        // Return true if current player choices contains each value of the current winning condition
        if (condition.every((value) => _pChoices.includes(value))) {
          _winner = true;
        }
      });

      if (_winner) {
        displayController.displayWinner(_currentPlayer);
      } else {
        // Assuming player 1 is X we set next player based on gameboard array size
        _currentPlayer = gameBoard.getGbLength() % 2 == 1 ? _playerO : _playerX;
        displayController.showTurn(_currentPlayer);
      }
    });
  });
})();
