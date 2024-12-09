export class GameLoop {
  constructor(updateFunction) {
    this.updateFunction = updateFunction;
    this.lastFrameTime = performance.now();
  }

  start() {
    const loop = () => {
      const now = performance.now();
      const delta = (now - this.lastFrameTime) / 1000;
      this.lastFrameTime = now;

      this.updateFunction(delta);
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}
