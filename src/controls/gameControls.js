export class GameControls {
  constructor() {
    this.keys = {};
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
  }

  handleKeyDown(event) {
    this.keys[event.key] = true;
  }

  handleKeyUp(event) {
    this.keys[event.key] = false;
  }

  isKeyPressed(key) {
    return this.keys[key] || false;
  }
}
