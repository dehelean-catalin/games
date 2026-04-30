import AbstractDrawer from "./AbstractDrawer.js";

export const TILE_SIZE_IN_PX = 40;
export const TILE_BACKGROUND_SIZE_IN_PX = 50;
const BOARD_SIZE_IN_PX = 600;

export const WALL_SIZE_IN_PX = TILE_BACKGROUND_SIZE_IN_PX - TILE_SIZE_IN_PX;

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

  drawWalls(state) {
    const length = state.walls.length;
    for (let xAxis = 0; xAxis < length; xAxis++) {
      for (let yAxis = 0; yAxis < length; yAxis++) {
        let wallStyle = state.isWallMode ? "white" : "gray";
        const wall = state.walls[xAxis][yAxis];
        const isWallEmpty = !wall?.size;

        if (xAxis < length - 1) {
          if (!isWallEmpty && wall.has("x")) {
            wallStyle = "blue";
          }
          this.ctx.fillStyle = wallStyle;
          this.ctx.fillRect(
            TILE_BACKGROUND_SIZE_IN_PX * yAxis,
            TILE_BACKGROUND_SIZE_IN_PX * xAxis + TILE_SIZE_IN_PX,
            TILE_SIZE_IN_PX,
            WALL_SIZE_IN_PX,
          );
        }

        if (yAxis < length - 1) {
          wallStyle = state.isWallMode ? "white" : "gray";
          if (!isWallEmpty && wall.has("y")) {
            wallStyle = "red";
          }
          this.ctx.fillStyle = wallStyle;
          this.ctx.fillRect(
            TILE_BACKGROUND_SIZE_IN_PX * yAxis + TILE_SIZE_IN_PX,
            TILE_BACKGROUND_SIZE_IN_PX * xAxis,
            WALL_SIZE_IN_PX,
            TILE_SIZE_IN_PX,
          );
        }
      }
    }
  }

  reset() {
    this.ctx.clearRect(0, 0, BOARD_SIZE_IN_PX, BOARD_SIZE_IN_PX);
  }
}

export default BoardDrawer;
