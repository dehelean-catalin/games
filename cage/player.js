class Player {
  #name = "";
  #rowNum = null;
  #columnNum = null;
  #color = null;
  #score = 0;
  #winningPosition = null;

  #drawer = null;
  #scoreDrawer = null;

  constructor(
    drawer,
    playerName,
    rowStartNum,
    columnStartNum,
    playerColor,
    scoreDrawer,
  ) {
    this.#drawer = drawer;
    this.#scoreDrawer = scoreDrawer;
    this.#name = playerName;
    this.#rowNum = rowStartNum;
    this.#columnNum = columnStartNum;
    this.#color = playerColor;
    if (rowStartNum === 0) {
      this.#winningPosition = 8;
    }
    if (rowStartNum === 8) {
      this.#winningPosition = 0;
    }
  }

  getName() {
    return this.#name;
  }

  getTilePosition() {
    return {
      row: this.#rowNum,
      column: this.#columnNum,
    };
  }

  hasTilePositionChanged(newRow, newColumn) {
    return newRow != this.#rowNum || newColumn != this.#columnNum;
  }

  draw(isMyTrun) {
    this.#drawer.draw(this.#rowNum, this.#columnNum, this.#color, isMyTrun);
  }

  moveTo(nextRowNum, nextColumnNum) {
    this.#rowNum = nextRowNum;
    this.#columnNum = nextColumnNum;
    this.draw();

    if (this.isWinningPosition()) {
      this.#score++;
      this.updateDisplayScore(this.#winningPosition === 0);
    }
  }

  isWinningPosition() {
    return this.#rowNum === this.#winningPosition;
  }

  restart(shouldClearScore = false) {
    if (this.#winningPosition === 0) {
      this.#rowNum = 8;
    } else {
      this.#rowNum = 0;
    }
    this.#columnNum = 4;
    if (shouldClearScore) {
      this.#score = 0;
      this.#scoreDrawer.restart();
    }
    this.draw(this.#winningPosition === 0);
  }

  updateDisplayScore(isMyWin) {
    this.#scoreDrawer.draw(this.#score, isMyWin);
  }

  restartDisplayScore() {
    this.#scoreDrawer.reset();
  }
}

export default Player;
