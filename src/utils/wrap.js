export const wrapObject = (object, mapa) => {
  if (object.position.x < mapa.esquerda) object.position.x = mapa.direita;
  else if (object.position.x > mapa.direita) object.position.x = mapa.esquerda;

  if (object.position.y > mapa.topo) object.position.y = mapa.baixo;
  else if (object.position.y < mapa.baixo) object.position.y = mapa.topo;
};
