import * as THREE from "three";
import { LEVEL } from "../utils/constants";
import { criarParede, criarPilulas, criarPilulasEspeciais } from "./models";

export const criarMapa = (cena, proporcaoLabirinto = LEVEL) => {
  let mapa = {
    baixo: -(proporcaoLabirinto.length - 1),
    cima: 0,
    esquerda: 0,
    direita: 0,
    pilulasComuns: 0,
    pacmanSpawn: null,
    fantasmaSpawn: null,
  };

  for (let linha = 0; linha < proporcaoLabirinto.length; linha++) {
    let y = -linha;
    mapa[y] = {};
    let length = Math.floor(proporcaoLabirinto[linha].length / 2);
    mapa.direita = Math.max(mapa.direita, length);

    for (
      let coluna = 0;
      coluna < proporcaoLabirinto[linha].length;
      coluna += 2
    ) {
      let x = Math.floor(coluna / 2);
      let celula = proporcaoLabirinto[linha][coluna];
      let object = null;

      if (celula === "#") {
        object = criarParede();
      } else if (celula === ".") {
        object = criarPilulas();
        mapa.pilulasComuns += 1;
      } else if (celula === "o") {
        object = criarPilulasEspeciais();
      } else if (celula === "P") {
        mapa.pacmanSpawn = new THREE.Vector3(x, y, 0);
      } else if (celula === "G") {
        mapa.fantasmaSpawn = new THREE.Vector3(x, y, 0);
      }

      if (celula === "D") {
        d1 = [y, x, 0];
        console.log(d1);
      }

      if (object) {
        object.position.set(x, y, 0);
        mapa[y][x] = object;
        cena.add(object);
      }
    }
  }
  mapa.centerX = (mapa.esquerda + mapa.direita) / 2;
  mapa.centerY = (mapa.baixo + mapa.topo) / 2;

  return mapa;
};
