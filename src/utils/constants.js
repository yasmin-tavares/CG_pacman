export const PACMAN_SPEED = 2;
export const PACMAN_RADIUS = 0.25;
export const FANTASMA_SPEED = 1.5;
export const FANTASMA_RADIUS = PACMAN_RADIUS * 1.25;
export const PILULAS_COMUNS_RADIUS = 0.05;
export const PILULAS_ESPECIAIS_RADIUS = PILULAS_COMUNS_RADIUS * 2;

export const UP = new THREE.Vector3(0, 0, 1);
export const ESQUERDA = new THREE.Vector3(-1, 0, 0);
export const TOPO = new THREE.Vector3(0, 1, 0);
export const DIREITA = new THREE.Vector3(1, 0, 0);
export const BAIXO = new THREE.Vector3(0, -1, 0);

export let paused = true;
export let key1 = false;
export let key2 = false;
export let d1 = [0, 0, 0];
export let score = 0;
export let lives;
export let defaultCamera = [0, 0, 0];
export let cameraPlayer = true;
export let runAnim = true;
export let pauseOrbit;

export const LEVEL = [
  "# # # # # # # # # # # # # # # # # # # # # # # # # # # #",
  "# . . . . . . . . . . . . # # . . . . . . . . . . . . #",
  "# . # # # # . # # # # # . # # . # # # # # . # # # # . #",
  "# o # # # # . # # # # # . # # . # # # # # . # # # # o #",
  "# . # # # # . # # # # # . # # . # # # # # . # # # # . #",
  "# . . . . . . . . . . . . . . . . . . . . . . . . . . #",
  "# . # # # # . # # . # # # # # # # # . # # . # # # # . #",
  "# . # # # # . # # . # # # # # # # # . # # . # # # # . #",
  "# . . . . . . # # . . . . # # . . . . # # . . . . . . #",
  "# # # # # # . # # # # #   # #   # # # # # . # # # # # #",
  "          # . # # # # #   # #   # # # # # . #          ",
  "          # . # #         G           # # . #          ",
  "          # . # #   # # # # # # # #   # # . #          ",
  "# # # # # # . # #   #             #   # # . # # # # # #",
  "            .     D #             #       .            ",
  "# # # # # # . # #   #             #   # # . # # # # # #",
  "          # . # #   # # # # # # # #   # # . #          ",
  "          # . # #                     # # . #          ",
  "          # . # #   # # # # # # # #   # # . #          ",
  "# # # # # # . # #   # # # # # # # #   # # . # # # # # #",
  "# . . . . . . . . . . . . # # . . . . . . . . . . . . #",
  "# . # # # # . # # # # # . # # . # # # # # . # # # # . #",
  "# . # # # # . # # # # # . # # . # # # # # . # # # # . #",
  "# o . . # # . . . . . . . P   . . . . . . . # # . . o #",
  "# # # . # # . # # . # # # # # # # # . # # . # # . # # #",
  "# # # . # # . # # . # # # # # # # # . # # . # # . # # #",
  "# . . . . . . # # . . . . # # . . . . # # . . . . . . #",
  "# . # # # # # # # # # # . # # . # # # # # # # # # # . #",
  "# . # # # # # # # # # # . # # . # # # # # # # # # # . #",
  "# . . . . . . . . . . . . . . . . . . . . . . . . . . #",
  "# # # # # # # # # # # # # # # # # # # # # # # # # # # #",
];
