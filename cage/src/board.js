import AbstractEventListener from "./abstractEventListener.js";

class Board extends AbstractEventListener {
  static tileBackgroundSize = 50;

  #boardElement = null;
  #tilesNumber = 8;
  #players = [];
  #playerTurn = 0;
  #isGameCompleted = false;

  constructor(boardElement, ...players) {
    super();

    this.#boardElement = boardElement;
    this.#players = [...players];
  }

  init() {
    const firstPlayer = this.#players[0];
    this.draw(firstPlayer.getPosition());
    this.#players.forEach((player, idx) => player.draw(idx === 0));

    this.#boardElement.addEventListener("click", (e) =>
      this.handlePlayerMove.call(this, e),
    );
  }

  draw(nextPlayerPosition, newTilePosition, isWinner) {
    this.dispatch("change", {
      tilesNumber: 8,
      nextPlayerPosition: nextPlayerPosition,
      newTilePosition: newTilePosition,
      isWinner: isWinner,
    });
  }

  getPosition(e) {
    const column = Math.floor(
      (e.x - e.target.offsetLeft) / Board.tileBackgroundSize,
    );
    const row = Math.floor(
      (e.y - e.target.offsetTop) / Board.tileBackgroundSize,
    );

    if (column < 0 || row < 0) {
      return null;
    }

    if (row > this.#tilesNumber || column > this.#tilesNumber) {
      return null;
    }

    return { row, column };
  }

  isTileAdjestment(oldTilePosition, newTilePosition) {
    const rowDiff = Math.abs(oldTilePosition.row - newTilePosition.row);
    const columnDiff = Math.abs(
      oldTilePosition.column - newTilePosition.column,
    );

    return rowDiff <= 1 && columnDiff <= 1;
  }

  isTileBlockByNextPlayer(nextPlayerPosition, newPosition) {
    return (
      nextPlayerPosition.row === newPosition.row &&
      nextPlayerPosition.column === newPosition.column
    );
  }

  handlePlayerMove(e) {
    if (this.#isGameCompleted) {
      return;
    }

    const newPosition = this.getPosition(e);
    if (!newPosition) {
      return;
    }

    const currentPlayer = this.#players[this.#playerTurn];
    const nextPlayer = this.#players[this.getNextPlayerTurn()];
    if (
      !currentPlayer.hasTilePositionChanged(newPosition.row, newPosition.column)
    ) {
      return;
    }

    const isTileAdjestment = this.isTileAdjestment(
      currentPlayer.getPosition(),
      newPosition,
    );

    if (!isTileAdjestment) {
      return;
    }

    const isTileBlockByNextPlayer = this.isTileBlockByNextPlayer(
      nextPlayer.getPosition(),
      newPosition,
    );

    if (isTileBlockByNextPlayer) {
      return;
    }

    // Valid Position turn can start
    this.dispatch("reset");

    const isWinner = currentPlayer.isWinner(newPosition.row);
    this.draw(nextPlayer.getPosition(), newPosition, isWinner);
    currentPlayer.moveTo(newPosition.row, newPosition.column);
    nextPlayer.draw(!isWinner);

    this.dispatch("track-move", {
      playerName: currentPlayer.getName(),
      type: "move",
      position: newPosition,
    });

    if (isWinner) {
      this.dispatch("win", {
        playerName: currentPlayer.getName(),
        type: "move",
        position: newPosition,
      });
      this.#isGameCompleted = true;
      this.displayWinDialog();
      return;
    }
    this.updatePlayerTurn();
  }

  updatePlayerTurn() {
    if (this.#playerTurn === 0) {
      this.#playerTurn = 1;
    } else {
      this.#playerTurn = 0;
    }
  }

  getNextPlayerTurn() {
    return this.#playerTurn === 0 ? 1 : 0;
  }

  displayWinDialog() {
    const gameElement = document.getElementById("game");
    const dialogElement = document.createElement("dialog");
    gameElement.appendChild(dialogElement);

    const rematchBtn = document.createElement("button");
    rematchBtn.textContent = "Rematch";
    rematchBtn.addEventListener("click", () => {
      this.restartGame();
      dialogElement.close();
    });

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Restart";
    restartBtn.addEventListener("click", () => {
      this.restartGame(true);
      dialogElement.close();
    });

    dialogElement.appendChild(rematchBtn);
    dialogElement.appendChild(restartBtn);

    dialogElement.showModal();
  }

  restartGame(shouldRestartScore) {
    this.dispatch("reset");
    this.draw(this.#players[0].getInitialPosition());
    this.#players.forEach((player) => player.restart(shouldRestartScore));
    this.#isGameCompleted = false;
  }
}

export default Board;
