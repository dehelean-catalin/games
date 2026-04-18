class Player {
  #name = "";
  #row = null;
  #column = null;
  #color = null;
  #score = 0;
  #winnerRow = null;

  #drawer = null;
  #scoreDrawer = null;

  constructor(
    drawer,
    playerName,
    initalRow,
    initalColumn,
    playerColor,
    scoreDrawer,
  ) {
    this.#drawer = drawer;
    this.#scoreDrawer = scoreDrawer;
    this.#name = playerName;
    this.#row = initalRow;
    this.#column = initalColumn;
    this.#color = playerColor;
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

  getTilePosition() {
    return {
      row: this.#row,
      column: this.#column,
    };
  }

  hasTilePositionChanged(newRow, newColumn) {
    return newRow != this.#row || newColumn != this.#column;
  }

  draw(isMyTrun) {
    this.#drawer.draw(this.#row, this.#column, this.#color, isMyTrun);
  }

  moveTo(nextRow, nextColumn) {
    this.#row = nextRow;
    this.#column = nextColumn;
    this.draw(this.isWinner(nextRow));

    if (this.isWinner(nextRow)) {
      this.#score++;
      this.#scoreDrawer.draw(this.#score, this.#winnerRow === 0);
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
      this.#scoreDrawer.reset();
    }
    this.draw(isBottomPlayerWinner);
  }
}

export default Player;
