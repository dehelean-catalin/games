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

  draw(isMyTrun) {
    this.#ctx.beginPath();
    if (isMyTrun) {
      this.#ctx.shadowColor = "black";
      this.#ctx.shadowOffsetX = 2;
      this.#ctx.shadowOffsetY = 2;
    }
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
    this.#ctx.shadowBlur = 0;
    this.#ctx.shadowColor = "transparent";
  }

  moveTo(nextRowNum, nextColumnNum) {
    this.#rowNum = nextRowNum;
    this.#columnNum = nextColumnNum;
    this.draw();
  }
}

export default Player;
