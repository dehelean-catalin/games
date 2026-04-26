import AbstractDrawer from "./AbstractDrawer.js";

const TILE_SIZE_IN_PX = 48;
const TILE_BACKGROUND_SIZE_IN_PX = 50;
const BOARD_SIZE_IN_PX = 600;

class BoardDrawer extends AbstractDrawer {
  constructor(ctx) {
    super(ctx);
  }

  draw(state, isTileAdjestment) {
    for (let xAxis = 0; xAxis <= state.tilesNumber; xAxis++) {
      for (let yAxis = 0; yAxis <= state.tilesNumber; yAxis++) {
        this.ctx.fillStyle = "#f111f1";

        if (state.nextPlayerPosition && !state.isWinner) {
          const position = {
            row: xAxis,
            column: yAxis,
          };
          if (isTileAdjestment(position)) {
            this.ctx.fillStyle = "#ff89ff";

            if (
              state.newTilePosition?.column === yAxis &&
              state.newTilePosition?.row === xAxis
            ) {
              this.ctx.fillStyle = "#f111f1";
            }
          }
        }
        this.ctx.fillRect(
          TILE_BACKGROUND_SIZE_IN_PX * yAxis,
          TILE_BACKGROUND_SIZE_IN_PX * xAxis,
          TILE_SIZE_IN_PX,
          TILE_SIZE_IN_PX,
        );
      }
    }
  }
  reset() {
    this.ctx.clearRect(0, 0, BOARD_SIZE_IN_PX, BOARD_SIZE_IN_PX);
  }
}

export default BoardDrawer;
