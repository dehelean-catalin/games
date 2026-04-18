import { BOARD_ID } from "./main.js";
import Player from "./player.js";
import PlayerActionTracker from "./playerActionTracker.js";
import PlayerDrawer from "./ui/PlayerDrawer.js";
import ScoreDrawer from "./ui/ScoreDrawer.js";

class Board {
  static tileSize = 48;
  static tileBackgroundSize = 50;
  static boardSize = 600;

  #boardElement = null;
  #ctx = null;
  #tilesNumber = 0;
  #players = [];
  #tracker = null;
  #playerTurn = 0;
  #isGameCompleted = false;

  constructor(ctx, boardElement, tilesNumber, tracker, ...players) {
    this.#boardElement = boardElement;
    this.#ctx = ctx;
    this.#tilesNumber = tilesNumber;
    this.#tracker = tracker;
    this.#isGameCompleted = false;
    this.#players = [...players];

    this.draw(players[0].getPosition());
    this.#players.forEach((player, idx) => player.draw(idx === 0));

    this.#boardElement.addEventListener("click", (e) =>
      this.handlePlayerMove.call(this, e),
    );
  }

  draw(nextPlayerPosition, newTilePosition, isWinner) {
    for (let xAxis = 0; xAxis <= this.#tilesNumber; xAxis++) {
      for (let yAxis = 0; yAxis <= this.#tilesNumber; yAxis++) {
        this.#ctx.fillStyle = "#f111f1";

        if (nextPlayerPosition && !isWinner) {
          const position = {
            row: xAxis,
            column: yAxis,
          };
          if (this.isTileAdjestment(nextPlayerPosition, position)) {
            this.#ctx.fillStyle = "#ff89ff";

            if (
              newTilePosition?.column === yAxis &&
              newTilePosition?.row === xAxis
            ) {
              this.#ctx.fillStyle = "#f111f1";
            }
          }
        }
        this.#ctx.fillRect(
          Board.tileBackgroundSize * yAxis,
          Board.tileBackgroundSize * xAxis,
          Board.tileSize,
          Board.tileSize,
        );
      }
    }
  }

  clearBoard() {
    this.#ctx.clearRect(0, 0, Board.boardSize, Board.boardSize);
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

    this.clearBoard();

    const isWinner = currentPlayer.isWinner(newPosition.row);
    this.draw(nextPlayer.getPosition(), newPosition, isWinner);
    currentPlayer.moveTo(newPosition.row, newPosition.column);
    nextPlayer.draw(!isWinner);

    this.#tracker.track(
      currentPlayer.getName(),
      "move",
      newPosition.row,
      newPosition.column,
    );

    if (isWinner) {
      this.#tracker.track(
        currentPlayer.getName(),
        "Finish",
        newPosition.row,
        newPosition.column,
      );
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
    this.clearBoard();
    this.draw(this.#players[0].getInitialPosition());
    this.#players.forEach((player) => player.restart(shouldRestartScore));
    this.#isGameCompleted = false;
  }
}

export default Board;
