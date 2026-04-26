class AbstractEventListener {
  #listeners = {};
  constructor() {}

  on(evt, listener) {
    if (this.#listeners.hasOwnProperty(evt)) {
      this.#listeners[evt] = [...this.#listeners[evt], listener];
    } else {
      this.#listeners[evt] = [listener];
    }
    return this;
  }

  dispatch(evt, payload) {
    this.#listeners[evt].forEach((listener) =>
      listener(payload, (position) =>
        this.isTileAdjestment(payload.nextPlayerPosition, position),
      ),
    );
  }
}

export default AbstractEventListener;
