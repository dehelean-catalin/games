class Player {
  #name = "";
  #rowNum = null;
  #columnNum = null;
  #color = null;
  #ctx = null;

  constructor(ctx, playerName, rowStartNum, columnStartNum, playerColor) {
    this.#ctx = ctx;
    this.#name = playerName;
    this.#rowNum = rowStartNum;
    this.#columnNum = columnStartNum;
    this.#color = playerColor;
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

  draw() {
    this.#ctx.beginPath();
    this.#ctx.arc(
      this.#columnNum * 50 + 25,
      this.#rowNum * 50 + 25,
      15,
      0,
      2 * Math.PI,
    );
    this.#ctx.fillStyle = this.#color;
    this.#ctx.fill();
    this.#ctx.stroke();
  }

  moveTo(nextRowNum, nextColumnNum) {
    this.#rowNum = nextRowNum;
    this.#columnNum = nextColumnNum;
    this.draw();
  }
}

export default Player;
