import * as THREE from "three";

export class LightManager {
  constructor(scene) {
    this.light = new THREE.PointLight(0xffffff, 1, 100);
    this.light.position.set(0, 10, 0);
    this.scene = scene;
    this.isLightOn = true;
    this.scene.add(this.light);
  }

  toggleLight() {
    if (this.isLightOn) {
      this.scene.remove(this.light);
    } else {
      this.scene.add(this.light);
    }
    this.isLightOn = !this.isLightOn;
  }
}
