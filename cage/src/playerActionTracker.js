const PLAYER_ACTION_TRACKER_ID = "player-action-tracker";

class PlayerActionTracker {
  #actions = [];
  constructor() {}
  track(playerName, actionType, position) {
    this.#actions.push({ playerName, actionType });
    this.add(playerName, actionType, position);
    console.log(this.#actions);
  }

  add(playerName, actionType, position) {
    const trackerElement = document.getElementById(PLAYER_ACTION_TRACKER_ID);
    const newTrackerItemElement = document.createElement("li");
    newTrackerItemElement.textContent = `${playerName} - ${actionType} to ${position.row}:${position.column}`;
    trackerElement.appendChild(newTrackerItemElement);
  }
}

export default PlayerActionTracker;
