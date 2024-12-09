import * as THREE from "three";
import { PILULAS_COMUNS_RADIUS } from "../utils/constants";

export const criarPilulas = () => {
  const pilulasGeometry = new THREE.SphereGeometry(PILULAS_COMUNS_RADIUS);
  const pilulasMaterial = new THREE.MeshPhongMaterial({ color: 0xffdab9 });
  const pilulas = new THREE.Mesh(pilulasGeometry, pilulasMaterial);
  pilulas.pilulasComuns = true;
  return pilulas;
};
