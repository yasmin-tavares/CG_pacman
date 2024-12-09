class PauseControls {
  constructor() {
    this.paused = false;
  }

  togglePause() {
    this.paused = !this.paused;
    return this.paused;
  }
}

export default PauseControls;
