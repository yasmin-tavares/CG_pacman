class MovementControls {
  constructor(object, movementSpeed, checkWallCollision) {
    this.object = object;
    this.movementSpeed = movementSpeed;
    this.checkWallCollision = checkWallCollision;
    this.movement = { left: false, right: false, up: false, down: false };
  }

  move(delta) {
    const moveSpeed = delta * this.movementSpeed;
    const positions = {
      left: [-moveSpeed, 0],
      right: [moveSpeed, 0],
      up: [0, moveSpeed],
      down: [0, -moveSpeed],
    };

    Object.keys(this.movement).forEach((direction) => {
      if (this.movement[direction]) {
        this.object.translateX(positions[direction][0]);
        this.object.translateY(positions[direction][1]);
        if (this.checkWallCollision(this.object.position, direction)) {
          this.object.translateX(-positions[direction][0]);
          this.object.translateY(-positions[direction][1]);
        }
      }
    });
  }

  setMovementDirection(direction, value) {
    this.movement[direction] = value;
  }
}

export default MovementControls;
