class Drawer {
  ctx = null;

  constructor(ctx) {
    this.ctx = ctx;
  }

  draw() {
    throw new Error("Missing implementation for draw");
  }

  reset() {
    throw new Error("Missing implementation for reset");
  }
}

export default Drawer;
