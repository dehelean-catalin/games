import AbstractEventListener from "./abstractEventListener.js";

class Player extends AbstractEventListener {
  #name = "";
  #row = null;
  #column = null;
  #initialRow = null;
  #initialColumn = null;
  #color = null;
  #score = 0;
  #winnerRow = null;

  constructor(playerName, initalRow, initalColumn, playerColor) {
    super();
    this.#name = playerName;
    this.#row = initalRow;
    this.#column = initalColumn;
    this.#color = playerColor;
    this.#initialRow = initalRow;
    this.#initialColumn = initalColumn;

    if (initalRow === 0) {
      this.#winnerRow = 8;
    }
    if (initalRow === 8) {
      this.#winnerRow = 0;
    }
  }

  getName() {
    return this.#name;
  }

  getPosition() {
    return {
      row: this.#row,
      column: this.#column,
    };
  }

  getInitialPosition() {
    return {
      row: this.#initialRow,
      column: this.#initialColumn,
    };
  }

  hasTilePositionChanged(newRow, newColumn) {
    return newRow != this.#row || newColumn != this.#column;
  }

  draw(isMyTurn) {
    this.dispatch("draw", { row: this.#row, column: this.#column, color: this.#color, isMyTurn });
  }

  moveTo(nextRow, nextColumn) {
    this.#row = nextRow;
    this.#column = nextColumn;
    this.draw(this.isWinner(nextRow));

    if (this.isWinner(nextRow)) {
      this.#score++;
      this.dispatch("score", { score: this.#score, isBottomPlayer: this.#winnerRow === 0 });
    }
  }

  isWinner(row) {
    return this.#winnerRow === row;
  }

  restart(shouldClearScore = false) {
    const isBottomPlayerWinner = this.#winnerRow === 0;
    if (isBottomPlayerWinner) {
      this.#row = 8;
    } else {
      this.#row = 0;
    }
    this.#column = 4;
    if (shouldClearScore) {
      this.#score = 0;
      this.dispatch("score-reset");
    }
    this.draw(isBottomPlayerWinner);
  }
}

export default Player;
