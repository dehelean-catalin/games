import Board from "./board.js";
import Player from "./player.js";
import PlayerActionTracker from "./playerActionTracker.js";
import PlayerDrawer from "./ui/PlayerDrawer.js";
import ScoreDrawer from "./ui/ScoreDrawer.js";

export const BOARD_ID = "board";

(function main() {
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
  const redPlayer = new Player(
    playerDrawer,
    "Red",
    8,
    4,
    "#893311",
    scoreDrawer,
  );
  const playerActionTracker = new PlayerActionTracker();

  new Board(ctx, boardElement, 8, playerActionTracker, redPlayer, bluePlayer);
})();
