import {
  TILE_BACKGROUND_SIZE_IN_PX,
  TILE_SIZE_IN_PX,
  WALL_SIZE_IN_PX,
} from "../ui/boardDrawer.js";
import AbstractEventListener from "./abstractEventListener.js";

class Board extends AbstractEventListener {
  static tileBackgroundSize = 50;

  #boardElement = null;
  #tilesNumber = 8;
  #players = [];
  #playerTurn = 0;
  #isGameCompleted = false;
  #walls = []; // x,y, "bottom" / "left"
  #mode = "wall"; // "move" | "wall"
  #placeWallElement = null;

  constructor(boardElement, placeWallElement, ...players) {
    super();

    this.#boardElement = boardElement;
    this.#players = [...players];
    this.#placeWallElement = placeWallElement;

    this.#createEmptyWalls();

    placeWallElement.addEventListener("click", () =>
      this.toggleMode.call(this),
    );
  }

  #createEmptyWalls() {
    for (let i = 0; i <= this.#tilesNumber; i++) {
      this.#walls[i] = [];
      for (let j = 0; j <= this.#tilesNumber; j++) {
        this.#walls[i][j] = new Set();
      }
    }
  }

  init() {
    const firstPlayer = this.#players[0];
    this.draw(firstPlayer.getPosition());
    this.drawWall();
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

  drawWall() {
    this.dispatch("wall-move", {
      tilesNumber: 8,
      walls: this.#walls,
      isWallMode: this.isWallMode(),
    });
  }

  isWallMode() {
    return this.#mode === "wall";
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

  getWallPosition(e) {
    const rowDecimal = this.calculateWallPosition(e.y - e.target.offsetTop);
    if (rowDecimal === null) {
      return null;
    }
    const columnDecimal = this.calculateWallPosition(e.x - e.target.offsetLeft);
    if (columnDecimal === null) {
      return null;
    }
    const axis = this.calculateWallAxis(rowDecimal, columnDecimal);
    if (!axis) {
      return null;
    }
    const row = Math.floor(rowDecimal);
    const column = Math.floor(columnDecimal);
    if (axis === "x" && this.#tilesNumber === row) {
      return null;
    }
    if (axis === "y" && this.#tilesNumber === column) {
      return null;
    }
    return { row, column, axis };
  }

  calculateWallPosition(num) {
    if (num > TILE_BACKGROUND_SIZE_IN_PX * (this.#tilesNumber + 1)) {
      return null;
    }
    return num / TILE_BACKGROUND_SIZE_IN_PX;
  }

  calculateWallAxis(row, column) {
    const wallRatio = TILE_SIZE_IN_PX / TILE_BACKGROUND_SIZE_IN_PX;
    const rowRatio = row - Math.floor(row);
    const columnRatio = column - Math.floor(column);
    if (rowRatio < wallRatio && columnRatio < wallRatio) {
      return null;
    }
    if (rowRatio >= wallRatio) {
      return "x";
    }
    if (columnRatio >= wallRatio) {
      return "y";
    }
    return null;
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

  toggleMode() {
    if (this.#mode === "move") {
      this.#mode = "wall";
    } else {
      this.#mode = "move";
    }
    this.drawWall();
  }

  handlePlayerMove(e) {
    if (this.#isGameCompleted) {
      return;
    }

    const currentPlayer = this.#players[this.#playerTurn];
    const nextPlayer = this.#players[this.getNextPlayerTurn()];

    if (this.#mode === "wall") {
      const newWallPosition = this.getWallPosition(e);
      if (!newWallPosition?.axis) {
        return;
      }

      // Skip if a wall is already set
      if (
        this.#walls[newWallPosition.row][newWallPosition.column].has(
          newWallPosition.axis,
        )
      ) {
        return;
      }

      this.#walls[newWallPosition.row][newWallPosition.column].add(
        newWallPosition.axis,
      );

      this.toggleMode();

      this.draw(nextPlayer.getPosition(), currentPlayer.getPosition());
      this.#players.forEach((player) => player.draw());
      this.drawWall();

      this.updatePlayerTurn();
      return;
    }

    const newPlayerMove = this.isValidPlayerMove(e, currentPlayer, nextPlayer);

    // Valid Position - player turn start
    this.dispatch("reset");

    // TODO: First update state and then draw all
    const isWinner = currentPlayer.isWinner(newPlayerMove.row);
    this.draw(nextPlayer.getPosition(), newPlayerMove, isWinner);
    currentPlayer.moveTo(newPlayerMove.row, newPlayerMove.column);
    nextPlayer.draw(!isWinner);
    this.drawWall();

    this.dispatch("track-move", {
      playerName: currentPlayer.getName(),
      type: "move",
      position: newPlayerMove,
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

  isValidPlayerMove(e, currentPlayer, nextPlayer) {
    const newPosition = this.getPosition(e);
    if (!newPosition) {
      return;
    }

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

    return newPosition;
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
