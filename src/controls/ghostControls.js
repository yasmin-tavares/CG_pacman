var criar_fantasma = (function () {
  var fantasmaGeometry = new THREE.SphereGeometry(fantasma_RADIUS, 16, 16);

  return function (cena, posicao) {
    var fantasmaMaterial = new THREE.MeshPhongMaterial({ color: "red" });
    var fantasma = new THREE.Mesh(fantasmaGeometry, fantasmaMaterial);
    fantasma.isfantasma = true;
    fantasma.isWrapper = true;
    fantasma.isAfraid = false;

    fantasma.position.copy(posicao);
    fantasma.direction = new THREE.Vector3(-1, 0, 0);

    cena.add(fantasma);
  };
})();

var distance = (function () {
  var difference = new THREE.Vector3();

  return function (object1, object2) {
    difference.copy(object1.position).sub(object2.position);

    return difference.length();
  };
})();

var updatefantasma = function (fantasma, delta, now) {
  if (pacman.atepilulas_especiais === true) {
    fantasma.isAfraid = true;
    fantasma.becameAfraidTime = now;
    fantasma.material.color.setStyle("white");
  }

  if (fantasma.isAfraid && now - fantasma.becameAfraidTime > 10) {
    fantasma.isAfraid = false;
    fantasma.material.color.setStyle("red");
  }

  movefantasma(fantasma, delta);

  if (
    !lost &&
    !won &&
    distance(pacman, fantasma) < PACMAN_RADIUS + fantasma_RADIUS
  ) {
    handleGhostCollision(fantasma, now);
  }
};

var movefantasma = function (fantasma, delta) {
  var previousPosition = new THREE.Vector3();
  var currentPosition = new THREE.Vector3();
  var esquerdaTurn = new THREE.Vector3();
  var direitaTurn = new THREE.Vector3();

  return function (fantasma, delta) {
    previousPosition
      .copy(fantasma.position)
      .addScaledVector(fantasma.direction, 0.5)
      .round();
    fantasma.translateOnAxis(fantasma.direction, delta * fantasma_SPEED);
    currentPosition
      .copy(fantasma.position)
      .addScaledVector(fantasma.direction, 0.5)
      .round();

    if (!currentPosition.equals(previousPosition)) {
      esquerdaTurn.copy(fantasma.direction).applyAxisAngle(UP, Math.PI / 2);
      direitaTurn.copy(fantasma.direction).applyAxisAngle(UP, -Math.PI / 2);

      var forwardparede = parede(mapa, currentPosition);
      var esquerdaparede = parede(
        mapa,
        currentPosition.copy(fantasma.position).add(esquerdaTurn)
      );
      var direitaparede = parede(
        mapa,
        currentPosition.copy(fantasma.position).add(direitaTurn)
      );

      if (!esquerdaparede || !direitaparede) {
        var possibleTurns = [];
        if (!forwardparede) possibleTurns.push(fantasma.direction);
        if (!esquerdaparede) possibleTurns.push(esquerdaTurn);
        if (!direitaparede) possibleTurns.push(direitaTurn);

        if (possibleTurns.length === 0)
          throw new Error("A fantasma got stuck!");

        var newDirection =
          possibleTurns[Math.floor(Math.random() * possibleTurns.length)];
        fantasma.direction.copy(newDirection);

        fantasma.position.round().addScaledVector(fantasma.direction, delta);
      }
    }
  };
};

var handleGhostCollision = function (fantasma, now) {
  if (fantasma.isAfraid === true) {
    remove.push(fantasma);
    numfantasmas -= 1;
    killSound.play();
  } else {
    lives -= 1;
    document.getElementsByClassName("life")[lives].style.display = "none";
    lost = true;
    lostTime = now;
    deathSound.play();
    if (lives <= 0) {
      gameOver();
    }
  }
};

var gameOver = function () {
  window.alert(
    "fim de jogo; pontuacao: " +
      score +
      "recarregue a pagina para tentar novamente;"
  );
};
