// Rule of thumb:
// if you only ever need ONE of something (gameBoard, displayController), use a module.
// If you need multiples of something (players! we mean create instance of them), create them with factories.

const Player = (symbol, name) => {
  let _playerSymbol = symbol;
  let _playerName = name;
  let _score = 0;
  let _choices = [];

  const getSymbol = () => {
    return _playerSymbol;
  };

  const getName = () => {
    return _playerName
      ? _playerName[0].toUpperCase() + _playerName.slice(1).toLowerCase()
      : `Player ${_playerSymbol.toUpperCase()}`;
  };

  const addChoice = (choice) => {
    _choices.push(Number(choice));
  };

  const getChoices = () => {
    return _choices;
  };

  const incrementScore = () => {
    _score++;
  };

  const getScore = () => {
    return _score;
  };

  const reset = (type) => {
    if (type == "new") {
      _score = 0;
    }
    _choices = [];
  };

  return {
    getSymbol,
    getName,
    getChoices,
    addChoice,
    getScore,
    incrementScore,
    reset,
  };
};

// GAMEBOARD
const gameBoard = (() => {
  // odd number for pX and even number for pO
  let _gameboard = [];
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
  let _emptyCells = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Add index of square chosen by player to array
  const setChoice = (index, player) => {
    if (!(index > 0 && index < 10) || _gameboard.includes(index)) return;
    _gameboard.push(index);
    player.addChoice(index);
  };

  const getAIChoice = (previousPlayerChoice) => {
    // Update AI possibilities
    for (let i = 0; i < _emptyCells.length; i++) {
      if (_emptyCells[i] == previousPlayerChoice) {
        _emptyCells.splice(i, 1);
      }
    }

    return _emptyCells[Math.floor(Math.random() * _emptyCells.length)];
  };

  const checkWinner = (player) => {
    let isWinner = false;

    // Check if there is a winner
    _winningConditions.forEach((condition) => {
      // Return true if current player choices contains each value of the current winning condition
      if (condition.every((value) => player.getChoices().includes(value))) {
        isWinner = true;
      }
    });

    return isWinner;
  };

  const getGbLength = () => {
    return _gameboard.length;
  };

  const reset = (playerX, playerO) => {
    _gameboard = [];
    _emptyCells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    playerX.reset();
    playerO.reset();
    // Remove all marks from the board
    displayController.getSquares().forEach((square) => {
      square.textContent == "x"
        ? square.classList.remove("player-x")
        : square.classList.remove("player-o");
      square.textContent = "";
    });
    displayController.hideLockBoard();
  };

  return { setChoice, getAIChoice, checkWinner, reset, getGbLength };
})();

// DISPLAY CONTROLLER
const displayController = (() => {
  // Get display elements
  const _squares = document.querySelectorAll(".square");
  const _message = document.querySelector("#message p");
  const _locker = document.getElementById("locker");
  const _pXName = document.querySelector("#player-x h1");
  const _pXScore = document.querySelector("#player-x p");
  const _pOName = document.querySelector("#player-o h1");
  const _pOScore = document.querySelector("#player-o p");

  const getSquares = () => {
    return _squares;
  };

  // Display who's turn it is
  const showTurn = (player) => {
    _message.style.color = player.getSymbol() == "x" ? "#ffc200" : "#fa5c0c";
    _message.textContent = `${player.getName()}'s turn`;
  };

  const showResult = (player) => {
    let isEndGame = true;
    if (player) {
      _message.textContent = `${player.getName()} wins`;
    } else {
      _message.style.color = "#05ccab";
      _message.textContent = `This is a tie game`;
    }

    _locker.innerHTML = "<p>Game Over</p>";
    showLockBoard(isEndGame);
  };

  const showLockBoard = (isEnd) => {
    if (!isEnd) {
      _locker.innerHTML = "";
    }
    _locker.style.display = "grid";
  };

  const hideLockBoard = () => {
    _locker.style.display = "none";
  };

  const addSymbolToBoard = (square, player, isWinner) => {
    if (square.textContent != "" || isWinner) return;
    player.getSymbol() == "x"
      ? square.classList.add("player-x")
      : square.classList.add("player-o");
    square.textContent = player.getSymbol();
  };

  const showForm = (form) => {
    form.style.display = "flex";
    _message.style.display = "none";
  };

  const hideForm = (form) => {
    form.style.display = "none";
    _message.style.display = "block";
  };

  const showScore = (playerX, playerO) => {
    _pXName.textContent = playerX.getName();
    _pXScore.textContent = playerX.getScore();
    _pOName.textContent = playerO.getName();
    _pOScore.textContent = playerO.getScore();
  };

  const hideScore = () => {
    _pXName.textContent = "";
    _pXScore.textContent = "";
    _pOName.textContent = "";
    _pOScore.textContent = "";
  };

  const toggleAI = (aiBtn, form) => {
    if (aiBtn.checked) {
      form.elements[1].labels[0].style.color = "#ccc";
      form.elements[1].value = `Computer`;
      form.elements[1].setAttribute("disabled", "disabled");
    } else {
      form.elements[1].labels[0].style.color = "#000";
      form.elements[1].value = "";
      form.elements[1].removeAttribute("disabled");
    }
  };

  return {
    getSquares,
    showTurn,
    showLockBoard,
    hideLockBoard,
    addSymbolToBoard,
    showResult,
    showScore,
    hideScore,
    toggleAI,
    showForm,
    hideForm,
  };
})();

// GAME CONTROLLER
const gameController = (() => {
  const _form = document.querySelector("form");
  const _pXInput = document.getElementById("playerX");
  const _pOInput = document.getElementById("playerO");
  const _startBtn = document.getElementById("startBtn");
  const _restartBtn = document.getElementById("restartBtn");
  const _aiBtn = document.getElementById("ai");
  const _aiBlock = document.querySelector("#controls .form-field");

  let _playerX = Player("x");
  let _playerO = Player("o");
  let _currentPlayer = _playerX;
  let _isWinner = false;

  displayController.showLockBoard();
  _aiBtn.setAttribute("disabled", "disabled");
  _restartBtn.setAttribute("disabled", "disabled");

  displayController.getSquares().forEach((square) => {
    square.addEventListener("click", () => {
      let index = square.getAttribute("data-index");
      gameBoard.setChoice(index, _currentPlayer);
      displayController.addSymbolToBoard(square, _currentPlayer, _isWinner);

      _isWinner = gameBoard.checkWinner(_currentPlayer);

      if (_isWinner) {
        _currentPlayer.incrementScore();
        displayController.showScore(_playerX, _playerO);

        displayController.showResult(_currentPlayer);
        _startBtn.removeAttribute("disabled");
        _aiBtn.removeAttribute("disabled");
      } else if (gameBoard.getGbLength() == 9) {
        displayController.showResult();
        _startBtn.removeAttribute("disabled");
        _aiBtn.removeAttribute("disabled");
      } else {
        _startBtn.setAttribute("disabled", "disabled");
        _aiBtn.setAttribute("disabled", "disabled");
        // Assuming player 1 is X we set next player based on gameboard array size
        _currentPlayer = gameBoard.getGbLength() % 2 == 1 ? _playerO : _playerX;
        displayController.showTurn(_currentPlayer);

        if (_currentPlayer.getName() == "Computer") {
          document
            .querySelector(`[data-index="${gameBoard.getAIChoice(index)}"]`)
            .click();
        }
      }
    });
  });

  _form.addEventListener("submit", (e) => {
    e.preventDefault();
    _playerX = Player("x", _pXInput.value);
    _playerO = Player("o", _pOInput.value);

    _form.reset();
    _aiBtn.checked = false;

    _currentPlayer = _playerX;

    gameBoard.reset(_playerX, _playerO);

    displayController.hideForm(_form);
    displayController.hideLockBoard();
    displayController.showTurn(_currentPlayer);
    displayController.showScore(_playerX, _playerO);

    _aiBlock.style.display = "none";
    _restartBtn.removeAttribute("disabled");
  });

  _startBtn.addEventListener("click", () => {
    _isWinner = false;
    gameBoard.reset(_playerX, _playerO, "new");
    displayController.showLockBoard();
    displayController.hideScore();
    displayController.showForm(_form);

    displayController.toggleAI(_aiBtn, _form);
    _aiBlock.style.display = "flex";
    _aiBtn.removeAttribute("disabled");

    _restartBtn.setAttribute("disabled", "disabled");
  });

  _aiBtn.addEventListener("click", (e) => {
    displayController.toggleAI(e.target, _form);
  });

  _restartBtn.addEventListener("click", () => {
    _isWinner = false;
    _currentPlayer = _playerX;
    displayController.showTurn(_currentPlayer);
    gameBoard.reset(_playerX, _playerO);
    _startBtn.removeAttribute("disabled");
    _aiBtn.removeAttribute("disabled");
  });
})();
