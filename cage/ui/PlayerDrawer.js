import AbstractDrawer from "./AbstractDrawer.js";
import { TILE_SIZE_IN_PX, TILE_BACKGROUND_SIZE_IN_PX } from "./boardDrawer.js";

const PLAYER_POSITION_IN_PX = TILE_SIZE_IN_PX / 2;
const PLAYER_SIZE_IN_PX = TILE_SIZE_IN_PX / 3;

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
    this.ctx.arc(
      column * TILE_BACKGROUND_SIZE_IN_PX + PLAYER_POSITION_IN_PX,
      row * TILE_BACKGROUND_SIZE_IN_PX + PLAYER_POSITION_IN_PX,
      PLAYER_SIZE_IN_PX,
      0,
      2 * Math.PI,
    );
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = "transparent";
  }
}

export default PlayerDrawer;
