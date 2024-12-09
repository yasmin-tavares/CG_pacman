var criar_pacman = (function () {
  var pacmanGeometries = [];
  var numFrames = 40;
  var offset;
  for (var i = 0; i < numFrames; i++) {
    offset = (i / (numFrames - 1)) * Math.PI;
    pacmanGeometries.push(
      new THREE.SphereGeometry(
        PACMAN_RADIUS,
        16,
        16,
        offset,
        Math.PI * 2 - offset * 2
      )
    );
    pacmanGeometries[i].rotateX(Math.PI / 2);
  }

  var pacmanMaterial = new THREE.MeshPhongMaterial({
    color: "yellow",
    side: THREE.DoubleSide,
  });

  return function (scene, position) {
    var pacman = new THREE.Mesh(pacmanGeometries[0], pacmanMaterial);
    pacman.frames = pacmanGeometries;
    pacman.currentFrame = 0;

    pacman.isPacman = true;
    pacman.isWrapper = true;
    pacman.atepilulas_especiais = false;
    pacman.distanceMoved = 0;

    pacman.position.copy(position);
    pacman.direction = new THREE.Vector3(-1, 0, 0);

    scene.add(pacman);

    return pacman;
  };
})();

var updatePacman = function (delta, now) {
  if (!won && !lost && (keys["W"] || keys["S"])) {
    chompSound.play();
  } else {
    chompSound.pause();
  }

  if (!won && !lost) {
    movePacman(delta);
  }

  if (pilulas_comuns_engolidas === mapa.pilulas_comuns) {
    won = true;
    wonTime = now;
    levelStartSound.play();
  }

  if (won && now - wonTime > 3) {
    resetGame();
  }

  if (lives > 0 && lost && now - lostTime > 4) {
    resetAfterLoss();
  }

  updatePacmanAnimation();
};

var movePacman = function (delta) {
  var _lookAt = new THREE.Vector3();
  pacman.up.copy(pacman.direction).applyAxisAngle(UP, -Math.PI / 2);
  pacman.lookAt(_lookAt.copy(pacman.position).add(UP));

  if (keys["W"]) {
    pacman.translateOnAxis(esquerda, PACMAN_SPEED * delta);
    pacman.distanceMoved += PACMAN_SPEED * delta;
  }
  if (keys["A"]) {
    pacman.direction.applyAxisAngle(UP, (Math.PI / 2) * delta);
  }
  if (keys["D"]) {
    pacman.direction.applyAxisAngle(UP, (-Math.PI / 2) * delta);
  }

  if (keys["S"]) {
    pacman.translateOnAxis(esquerda, -PACMAN_SPEED * delta);
    pacman.distanceMoved += PACMAN_SPEED * delta;
  }

  var esquerdaSide = pacman.position
    .clone()
    .addScaledVector(esquerda, PACMAN_RADIUS)
    .round();
  var topoSide = pacman.position
    .clone()
    .addScaledVector(topo, PACMAN_RADIUS)
    .round();
  var direitaSide = pacman.position
    .clone()
    .addScaledVector(direita, PACMAN_RADIUS)
    .round();
  var baixoSide = pacman.position
    .clone()
    .addScaledVector(baixo, PACMAN_RADIUS)
    .round();
  if (parede(mapa, esquerdaSide)) {
    pacman.position.x = esquerdaSide.x + 0.5 + PACMAN_RADIUS;
  }
  if (parede(mapa, direitaSide)) {
    pacman.position.x = direitaSide.x - 0.5 - PACMAN_RADIUS;
  }
  if (parede(mapa, topoSide)) {
    pacman.position.y = topoSide.y - 0.5 - PACMAN_RADIUS;
  }
  if (parede(mapa, baixoSide)) {
    pacman.position.y = baixoSide.y + 0.5 + PACMAN_RADIUS;
  }

  var celula = getAt(mapa, pacman.position);

  if (celula && celula.pilulascomuns === true && celula.visible === true) {
    removeAt(mapa, cena, pacman.position);
    score += 10;
    pilulas_comuns_engolidas += 1;
  }

  pacman.atepilulas_especiais = false;

  if (celula && celula.pilulasespeciais === true && celula.visible === true) {
    removeAt(mapa, cena, pacman.position);
    pacman.atepilulas_especiais = true;
    pilulas_especiais_engolidas += 1;
    score += 100;
    killSound.play();
  }
};

var updatePacmanAnimation = function () {
  // Atualiza a animação do Pac-Man
};

var resetGame = function () {
  pacman.position.copy(mapa.pacmanSpawn);
  pacman.direction.copy(esquerda);
  pacman.distanceMoved = 0;
  cena.children.forEach(function (object) {
    if (object.pilulascomuns === true || object.pilulasespeciais === true)
      object.visible = true;
    if (object.isfantasma === true) remove.push(object);
  });
  PACMAN_SPEED += 1;
  fantasma_SPEED += 1;
  won = false;
  pilulas_comuns_engolidas = 0;
  pilulas_especiais_engolidas = 0;
  numfantasmas = 0;
};

var resetAfterLoss = function () {
  lost = false;
  pacman.position.copy(mapa.pacmanSpawn);
  pacman.direction.copy(esquerda);
  pacman.distanceMoved = 0;

  if (lost) {
    var angle = ((now - lostTime) * Math.PI) / 2;
    var frame = Math.min(
      pacman.frames.length - 1,
      Math.floor((angle / Math.PI) * pacman.frames.length)
    );

    pacman.geometry = pacman.frames[frame];
  } else {
    var maxAngle = Math.PI / 4;
    var angle = (pacman.distanceMoved * 2) % (maxAngle * 2);
    if (angle > maxAngle) angle = maxAngle * 2 - angle;
    var frame = Math.floor((angle / Math.PI) * pacman.frames.length);

    pacman.geometry = pacman.frames[frame];
  }
};
