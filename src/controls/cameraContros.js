class CameraControls {
  constructor(camera, player, scene) {
    this.camera = camera;
    this.player = player;
    this.scene = scene;
    this.camOnPlayer = false;
  }

  toggleCameraPosition() {
    if (this.camOnPlayer) {
      this.camera.position.set(0, 500, 500); // Default position
      this.camera.lookAt(this.scene.position);
    } else {
      this.camera.position.set(
        this.player.position.x,
        this.player.position.y,
        this.player.position.z + 500
      );
      this.camera.lookAt(this.player.position);
    }
    this.camOnPlayer = !this.camOnPlayer;
  }
}

export default CameraControls;
