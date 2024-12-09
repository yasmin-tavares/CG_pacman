import * as THREE from "three";
import { Pacman } from "../components/Pacman";
import { Ghost } from "../components/Ghost";
import { LightManager } from "../components/LightManager";
import { GameControls } from "../components/GameControls";
import { GameLoop } from "../components/GameLoop";

export function MainScene() {
  // Configuração inicial
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 10);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Inicializando os componentes
  const pacman = new Pacman(scene, 5);
  const ghost1 = new Ghost(scene, 0xff0000, 2);
  const lightManager = new LightManager(scene);
  const controls = new GameControls();

  // Game Loop
  const gameLoop = new GameLoop((delta) => {
    if (controls.isKeyPressed("p")) lightManager.toggleLight();
    pacman.move(delta, controls.keys);
    ghost1.move(delta);
    renderer.render(scene, camera);
  });

  gameLoop.start();
}
