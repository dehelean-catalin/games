import AbstractDrawer from "./AbstractDrawer.js";

const MY_SCORE_ID = "score";
const OPP_SCORE_ID = "opponent-score";

class ScoreDrawer extends AbstractDrawer {
  constructor(ctx) {
    super(ctx);
  }

  draw(score, isMyWin) {
    const scoreElement = document.getElementById(
      isMyWin ? MY_SCORE_ID : OPP_SCORE_ID,
    );
    scoreElement.textContent = score;
  }

  reset() {
    const scoreElement = document.getElementById(MY_SCORE_ID);
    const opponentScoreElement = document.getElementById(OPP_SCORE_ID);

    scoreElement.textContent = "0";
    opponentScoreElement.textContent = "0";
  }
}

export default ScoreDrawer;
