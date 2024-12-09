import * as THREE from "three";
import { PILULAS_ESPECIAIS_RADIUS } from "../utils/constants";

export const criarPilulasEspeciais = () => {
  const pilulasGeometry = new THREE.SphereGeometry(
    PILULAS_ESPECIAIS_RADIUS,
    12,
    8
  );
  const pilulasMaterial = new THREE.MeshPhongMaterial({ color: 0xffdab9 });
  const pilulas = new THREE.Mesh(pilulasGeometry, pilulasMaterial);
  pilulas.pilulasEspeciais = true;
  return pilulas;
};
