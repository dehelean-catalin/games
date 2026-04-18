import Player from "./player.js";
import PlayerActionTracker from "./playerActionTracker.js";
import PlayerDrawer from "./ui/PlayerDrawer.js";
import ScoreDrawer from "./ui/ScoreDrawer.js";

const BOARD_ID = "board";

class Board {
  static tileSize = 48;
  static tileBackgroundSize = 50;
  #boardElement = null;
  #ctx = null;
  #boardSize = 600;
  #tilesNumber = 0;
  #players = [];
  #tracker = null;
  #playerTurn = 0;
  #isGameCompleted = false;

  constructor(ctx, boardElement, tilesNumber, tracker) {
    this.boardElement = boardElement;
    this.ctx = ctx;
    this.tilesNumber = tilesNumber;
    this.tracker = tracker;
    this.#isGameCompleted = false;

    this.draw();
  }

  draw() {
    for (let xAxis = 0; xAxis <= this.tilesNumber; xAxis++) {
      for (let yAxis = 0; yAxis <= this.tilesNumber; yAxis++) {
        this.ctx.fillStyle = "#f111f1";
        this.ctx.fillRect(
          Board.tileBackgroundSize * yAxis,
          Board.tileBackgroundSize * xAxis,
          Board.tileSize,
          Board.tileSize,
        );
      }
    }
  }

  addPlayers(...players) {
    this.players = [...players];
    this.players.forEach((player, idx) => player.draw(idx === 0));

    window.addEventListener("click", (e) =>
      this.handlePlayerMove.call(this, e),
    );
  }

  clearBoard() {
    this.ctx.clearRect(0, 0, this.boardSize, this.boardSize);
  }

  getTilePosition(e) {
    const column = Math.floor(
      (e.x - e.target.offsetLeft) / Board.tileBackgroundSize,
    );
    const row = Math.floor(
      (e.y - e.target.offsetTop) / Board.tileBackgroundSize,
    );

    if (column < 0 || row < 0) {
      return null;
    }

    if (row > this.tilesNumber || column > this.tilesNumber) {
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
    if (e.target.id != BOARD_ID) {
      return;
    }

    const newTilePosition = this.getTilePosition(e);
    if (!newTilePosition) {
      return;
    }

    const currentPlayer = this.players[this.#playerTurn];
    const nextPlayer = this.players[this.getNextPlayerTurn()];
    if (
      !currentPlayer.hasTilePositionChanged(
        newTilePosition.row,
        newTilePosition.column,
      )
    ) {
      return;
    }

    const isTileAdjestment = this.isTileAdjestment(
      currentPlayer.getTilePosition(),
      newTilePosition,
    );

    if (!isTileAdjestment) {
      return;
    }

    const isTileBlockByNextPlayer = this.isTileBlockByNextPlayer(
      nextPlayer.getTilePosition(),
      newTilePosition,
    );

    if (isTileBlockByNextPlayer) {
      return;
    }

    this.clearBoard();
    this.draw();

    currentPlayer.moveTo(newTilePosition.row, newTilePosition.column);
    nextPlayer.draw(true);

    this.tracker.track(
      currentPlayer.getName(),
      "move",
      newTilePosition.row,
      newTilePosition.column,
    );
    if (currentPlayer.isWinningPosition()) {
      this.tracker.track(
        currentPlayer.getName(),
        "Finish",
        newTilePosition.row,
        newTilePosition.column,
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
    this.draw();
    this.players.forEach((player) => player.restart(shouldRestartScore));
    this.#isGameCompleted = false;
  }
}

const boardElement = document.getElementById(BOARD_ID);
const ctx = boardElement.getContext("2d");

const playerDrawer = new PlayerDrawer(ctx);
const scoreDrawer = new ScoreDrawer(ctx);

const bluePlayer = new Player(
  playerDrawer,
  "Blue",
  0,
  4,
  "#1181f1",
  scoreDrawer,
);
const redPlayer = new Player(playerDrawer, "Red", 8, 4, "#893311", scoreDrawer);
const playerActionTracker = new PlayerActionTracker();

const board = new Board(ctx, boardElement, 8, playerActionTracker);
board.addPlayers(redPlayer, bluePlayer);
