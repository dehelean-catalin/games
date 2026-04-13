const PLAYER_ACTION_TRACKER_ID = "player-action-tracker";

class PlayerActionTracker {
  #actions = [];
  constructor() {}
  track(playerName, actionType, row, column) {
    this.#actions.push({ playerName, actionType });
    this.add(playerName, actionType, row, column);
    console.log(this.#actions);
  }

  add(playerName, actionType, row, column) {
    const trackerElement = document.getElementById(PLAYER_ACTION_TRACKER_ID);
    const newTrackerItemElement = document.createElement("li");
    newTrackerItemElement.textContent = `${playerName} - ${actionType} to ${row}:${column}`;
    trackerElement.appendChild(newTrackerItemElement);
  }
}

export default PlayerActionTracker;
