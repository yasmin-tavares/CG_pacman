import * as THREE from "three";

export const criarCena = () => {
  const cena = new THREE.Scene();
  cena.add(new THREE.AmbientLight(0x888888));
  const light = new THREE.SpotLight("white", 0.5);
  light.position.set(0, 0, 50);
  cena.add(light);
  return cena;
};

export const camera2 = (cam, pacman, key1, key2, cameraPlayer, UP) => {
  if (key1 && !cameraPlayer) {
    cameraPlayer = true;
  }

  if (key2 && cameraPlayer) {
    cameraPlayer = false;
    const p = pacman.position;
    cam.position.set(p.x, p.y, p.z + 35);
    cam.up.copy(UP);
    cam.lookAt(p);
  }

  return cameraPlayer;
};
