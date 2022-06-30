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

  const resetChoices = () => {
    _choices = [];
  };

  return { getSymbol, getChoices, addChoice, resetChoices };
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

  const reset = (playerX, playerO) => {
    _gameboard = [];
    playerX.resetChoices();
    playerO.resetChoices();
    displayController.reset();
  };

  return { setChoice, reset, getGbLength };
})();

const displayController = (() => {
  // Get display elements
  const _squares = document.querySelectorAll(".square");
  const _message = document.querySelector("#message p");
  const _locker = document.getElementById("locker");

  const getSquares = () => {
    return _squares;
  };
  // Display who's turn it is
  const showTurn = (player) => {
    _message.style.color = player.getSymbol() == "x" ? "#ffc200" : "#fa5c0c";
    _message.textContent = `Player ${player.getSymbol().toUpperCase()}'s turn`;
  };

  const displayResult = (player) => {
    if (player) {
      _message.textContent = `Player ${player.getSymbol().toUpperCase()} wins`;
    } else {
      _message.style.color = "#05ccab";
      _message.textContent = `This is a tie game`;
    }
    _showLockBoard();
  };

  const _showLockBoard = () => {
    _locker.style.display = "grid";
  };

  const _hideLockBoard = () => {
    _locker.style.display = "none";
  };

  //
  const addSymbolToBoard = (square, player, winner) => {
    if (square.textContent != "" || winner) return;
    player.getSymbol() == "x"
      ? square.classList.add("player-x")
      : square.classList.add("player-o");
    square.textContent = player.getSymbol();
  };

  const reset = () => {
    _squares.forEach((square) => {
      square.textContent == "x"
        ? square.classList.remove("player-x")
        : square.classList.remove("player-o");
      square.textContent = "";
    });
    _hideLockBoard();
  };

  return {
    getSquares,
    showTurn,
    addSymbolToBoard,
    displayResult,
    reset,
  };
})();

const gameController = (() => {
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
  const _startBtn = document.getElementById("startBtn");
  const _restartBtn = document.getElementById("restartBtn");

  displayController.showTurn(_currentPlayer);

  displayController.getSquares().forEach((square) => {
    square.addEventListener("click", () => {
      let index = square.getAttribute("data-index");
      gameBoard.setChoice(index, _currentPlayer);
      displayController.addSymbolToBoard(square, _currentPlayer, _winner);

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
        displayController.displayResult(_currentPlayer);
        _startBtn.removeAttribute("disabled");
      } else if (gameBoard.getGbLength() == 9) {
        displayController.displayResult();
        _startBtn.removeAttribute("disabled");
      } else {
        _startBtn.setAttribute("disabled", "disabled");
        // Assuming player 1 is X we set next player based on gameboard array size
        _currentPlayer = gameBoard.getGbLength() % 2 == 1 ? _playerO : _playerX;
        displayController.showTurn(_currentPlayer);
      }
    });
  });

  _restartBtn.addEventListener("click", () => {
    _winner = false;
    _currentPlayer = _playerX;
    displayController.showTurn(_currentPlayer);
    gameBoard.reset(_playerX, _playerO);
    _startBtn.removeAttribute("disabled");
  });
})();
