import Board from "./src/board.js";
import Player from "./src/player.js";
import PlayerActionTracker from "./src/playerActionTracker.js";
import BoardDrawer from "./ui/boardDrawer.js";
import PlayerDrawer from "./ui/PlayerDrawer.js";
import ScoreDrawer from "./ui/ScoreDrawer.js";

export const BOARD_ID = "board";

(function main() {
  const boardElement = document.getElementById(BOARD_ID);
  const ctx = boardElement.getContext("2d");

  const playerDrawer = new PlayerDrawer(ctx);
  const scoreDrawer = new ScoreDrawer(ctx);
  const boardDrawer = new BoardDrawer(ctx);

  const bluePlayer = new Player("Blue", 0, 4, "#1181f1");
  bluePlayer
    .on("draw", ({ row, column, color, isMyTurn }) => playerDrawer.draw(row, column, color, isMyTurn))
    .on("score", ({ score, isBottomPlayer }) => scoreDrawer.draw(score, isBottomPlayer))
    .on("score-reset", () => scoreDrawer.reset());

  const redPlayer = new Player("Red", 8, 4, "#893311");
  redPlayer
    .on("draw", ({ row, column, color, isMyTurn }) => playerDrawer.draw(row, column, color, isMyTurn))
    .on("score", ({ score, isBottomPlayer }) => scoreDrawer.draw(score, isBottomPlayer))
    .on("score-reset", () => scoreDrawer.reset());

  const playerActionTracker = new PlayerActionTracker();

  const board = new Board(boardElement, redPlayer, bluePlayer);

  board
    .on("change", (state, cb) => boardDrawer.draw(state, cb))
    .on("reset", () => boardDrawer.reset())
    .on("track-move", (state) =>
      playerActionTracker.track(state.playerName, state.type, state.position),
    )
    .on("win", (state) =>
      playerActionTracker.track(state.playerName, state.type, state.position),
    )
    .init();
})();
