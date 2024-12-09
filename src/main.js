import CameraControls from "./controls/CameraControls";
import MovementControls from "./controls/MovementControls";
import LightControls from "./controls/LightControls";
import PauseControls from "./controls/PauseControls";

const cameraControls = new CameraControls(camera, player, scene);
const movementControls = new MovementControls(player, 50, checkWallCollision);
const lightControls = new LightControls(scene, light);
const pauseControls = new PauseControls();

document.addEventListener("keydown", (event) => {
  // Update the movement directions based on key presses
  if (event.keyCode === 38) movementControls.setMovementDirection("up", true);
  if (event.keyCode === 40) movementControls.setMovementDirection("down", true);
  if (event.keyCode === 37) movementControls.setMovementDirection("left", true);
  if (event.keyCode === 39)
    movementControls.setMovementDirection("right", true);

  if (event.keyCode === 49) cameraControls.toggleCameraPosition(); // Camera toggle
  if (event.keyCode === 76) lightControls.toggleLight(); // Light toggle
  if (event.keyCode === 80) pauseControls.togglePause(); // Pause toggle
});

document.addEventListener("keyup", (event) => {
  if (event.keyCode === 38) movementControls.setMovementDirection("up", false);
  if (event.keyCode === 40)
    movementControls.setMovementDirection("down", false);
  if (event.keyCode === 37)
    movementControls.setMovementDirection("left", false);
  if (event.keyCode === 39)
    movementControls.setMovementDirection("right", false);
});

function animate() {
  // Update movement
  if (!pauseControls.paused) {
    movementControls.move(deltaTime);
  }
  requestAnimationFrame(animate);
}

animate();
