import AbstractDrawer from "./AbstractDrawer.js";

class PlayerDrawer extends AbstractDrawer {
  constructor(ctx) {
    super(ctx);
  }
  draw(row, column, color, isMyTrun) {
    this.ctx.beginPath();
    if (isMyTrun) {
      this.ctx.shadowColor = "black";
      this.ctx.shadowOffsetX = 2;
      this.ctx.shadowOffsetY = 2;
    }
    this.ctx.arc(column * 50 + 25, row * 50 + 25, 15, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = "transparent";
  }
}

export default PlayerDrawer;
