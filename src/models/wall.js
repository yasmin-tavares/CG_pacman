const getAt = (mapa, posicao) => {
  const x = Math.round(posicao.x),
    y = Math.round(posicao.y);
  return mapa[y] && mapa[y][x];
};

export const isWall = (mapa, posicao) => {
  const cell = getAt(mapa, posicao);
  return cell && cell.parede === true;
};

export const removeAt = (mapa, cena, posicao) => {
  const x = Math.round(posicao.x),
    y = Math.round(posicao.y);
  const cell = mapa[y] && mapa[y][x];
  if (cell) {
    cell.visible = false;
  }
};

export const createWall = (() => {
  const wallTexture = new THREE.TextureLoader().load("blue.jpg");
  const wallGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

  return () => {
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.castShadow = true;
    wall.receiveShadow = true;
    wall.parede = true;
    return wall;
  };
})();
