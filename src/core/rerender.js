import * as THREE from "three";

export const criarRenderer = () => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor("black", 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  const canvas = document.getElementById("gameCanvas");
  canvas.appendChild(renderer.domElement);
  return renderer;
};
