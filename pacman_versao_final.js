/* -------------------------------------------------------------- CRIANDO PAredES ---------------------------------------------------- */

var getAt = function (mapa, posicao) {
  var x = Math.round(posicao.x),
    y = Math.round(posicao.y);
  return mapa[y] && mapa[y][x];
};

var parede = function (mapa, posicao) {
  // função da parede
  var celula = getAt(mapa, posicao); // a variável celula é utilizada para compor as paredes
  return celula && celula.parede === true; // do labirinto, desde que o local no map que define sua composição seja verdadeira
};

var removeAt = function (mapa, cena, posicao) {
  var x = Math.round(posicao.x),
    y = Math.round(posicao.y);
  if (mapa[y] && mapa[y][x]) {
    mapa[y][x].visible = false;
  }
};

var criar_parede = (function () {
  // variável que recebe a função de criar a parede
  var paredeGeometry = new THREE.BoxGeometry(1, 1, 1); // cria um cubo
  var paredetexture = new THREE.TextureLoader().load("blue.jpg");
  //var paredeMaterial = new THREE.MeshLambertMaterial({ color: 'green' });							// define a cor do cubo
  var paredeMaterial = new THREE.MeshLambertMaterial({ map: paredetexture });

  return function () {
    // função para criar a parede
    var labirinto = new THREE.Mesh(paredeGeometry, paredeMaterial); // uma variável parede é criada e recebe a 'malha' definida anteriormente
    labirinto.parede = true; // se os valores forem verdadeiros
    return labirinto; // retorna a parede
  };
})();
/* ----------------------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------ CRIANDO PÍLULAS ------------------------------------------------------ */

var criar_pilulas = (function () {
  // variável que recebe a função de criar pílulas
  var pilulas_comunsGeometry = new THREE.SphereGeometry(pilulas_comuns_RADIUS); // cria a bolinha da pílula
  var pilulas_comunsMaterial = new THREE.MeshPhongMaterial({ color: 0xffdab9 }); // define a cor da mesma

  return function () {
    // função para criar a pílula
    var pilulas_comuns = new THREE.Mesh(
      pilulas_comunsGeometry,
      pilulas_comunsMaterial
    ); // recebe cada pílula criada
    pilulas_comuns.pilulascomuns = true; // se houver uma pílula criada

    return pilulas_comuns; // retorna cada pílula formando o caminho
  };
})();

/* ----------------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------ CRIANDO PÍLULAS ESPECIAIS -------------------------------------------------- */

var criar_pilulas_especiais = (function () {
  // variável que recebe a função de criar pílulas especiais
  var pilulas_especiaisGeometry = new THREE.SphereGeometry(
    pilulas_especiais_RADIUS,
    12,
    8
  ); // cria a bolinha da pílula
  var pilulas_especiaisMaterial = new THREE.MeshPhongMaterial({
    color: 0xffdab9,
  }); // define a cor da mesma

  return function () {
    // função para criar a pílula especial
    var pilulas_especiais = new THREE.Mesh(
      pilulas_especiaisGeometry,
      pilulas_especiaisMaterial
    ); // recebe cada pílula criada
    pilulas_especiais.pilulasespeciais = true; // se houver uma pílula criada

    return pilulas_especiais; // retorna cada pílula
  };
})();

/* ----------------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------- RENDERIZAÇÃO ----------------------------------------------------------- */

var criar_Renderer = function () {
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor("black", 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  var c = document.getElementById("gameCanvas");
  c.appendChild(renderer.domElement);

  return renderer;
};

/* ----------------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------- CRIANDO CENA ------------------------------------------------------- */
var light;
var lightOnOff = true;
var criar_cena = function () {
  var cena = new THREE.Scene();

  // Add lighting
  cena.add(new THREE.AmbientLight(0x888888));
  light = new THREE.SpotLight("white", 0.5);
  light.position.set(0, 0, 50);

  //if (lightOnOff == false){
  cena.add(light);
  //} else {
  //cena.remove(light);
  //}

  return cena;
};

/* ----------------------------------------------------------------------------------------------------------------------------------- */

/* -------------------------------------------------------------- Câmera 2 ----------------------------------------------------- */

function camera2(cam, pacman) {
  if (key1 & !camera_player) {
    camera_player = true;
  }

  if (key2 & camera_player) {
    camera_player = false;
    var p = pacman.position;
    cam.position.x = p.x;
    cam.position.y = p.y;
    cam.position.z = p.z + 35;
    cam.up.copy(UP);
    cam.lookAt(p);
  }
}

/* ----------------------------------------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------- CRIANDO O PAC-MAN ------------------------------------------------------ */
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
/* ----------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------- CRIANDO OS FANTASMAS ------------------------------------------------------ */

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

var wrapObject = function (object, mapa) {
  if (object.position.x < mapa.esquerda) object.position.x = mapa.direita;
  else if (object.position.x > mapa.direita) object.position.x = mapa.esquerda;

  if (object.position.y > mapa.topo) object.position.y = mapa.baixo;
  else if (object.position.y < mapa.baixo) object.position.y = mapa.topo;
};

/* ----------------------------------------------------------------------------------------------------------------------------- */

/* --------------------------------------------- PARTE GENÉRICA DO CÓDIGO ------------------------------------------------------ */
/* ---------------------------------------------------- distância  ------------------------------------------------------------- */
var distance = (function () {
  // variável que a função que calcula a distância entre 2 componentes
  var difference = new THREE.Vector3(); // variável: novo objeto 3d que representa a diferença das distâncias

  return function (object1, object2) {
    // retorno de 2 objetos
    difference.copy(object1.position).sub(object2.position); // Calcula a diferença entre as posições dos objetos.

    return difference.length(); // retorna o tamanho máximo da diferença de posições dos objetos em questão
  };
})();

/*-----------------------------------------------------------------------------------------------------------------------------*/

/* -------------------------------------------- controle de estado do teclado ------------------------------------------------- */

function togglePause(cam) {
  if (!paused) {
    paused = true;
    defaultCamera[0] = cam.position.x;
    defaultCamera[1] = cam.position.y;
    defaultCamera[2] = cam.position.z;
    pauseOrbit.enabled = true;
    pauseOrbit.reset();
    //pauseOrbit.target.set(pacman.position.x, pacman.position.y, pacman.position.z);
  } else if (paused) {
    paused = false;
    pauseOrbit.enabled = false;
    cam.position.set(defaultCamera[0], defaultCamera[1], defaultCamera[2]);
  }
}
function toggleL() {
  if (lightOnOff == false) {
    cena.remove(light);
    lightOnOff == true;
  } else {
    cena.add(light);
    lightOnOff == false;
  }
}

lightChanged = false;
var createKeyState = function (cam) {
  var keyState = {};

  window.addEventListener("keydown", function (e) {
    var key = e.keyCode;
    if (key === 80) {
      // p key P
      togglePause(cam);
    }
    if (key === 76) {
      // p key L
      lightOnOff = !lightOnOff;
      lightChanged = true;
    }
    if (key === 49) {
      // p key 1
      key1 = true;
    }
    if (key === 50) {
      // p key 2
      key2 = true;
    }
  });

  window.addEventListener("keyup", function (e) {
    var key = e.keyCode;
    if (key === 49) {
      // p key 1
      key1 = false;
    }
    if (key === 50) {
      // p key 2
      key2 = false;
    }
  });

  document.body.addEventListener("keydown", function (event) {
    keyState[event.keyCode] = true;
    keyState[String.fromCharCode(event.keyCode)] = true;
  });
  document.body.addEventListener("keyup", function (event) {
    keyState[event.keyCode] = false;
    keyState[String.fromCharCode(event.keyCode)] = false;
  });
  document.body.addEventListener("blur", function (event) {
    for (var key in keyState) {
      if (keyState.hasOwnProperty(key)) keyState[key] = false;
    }
  });

  return keyState;
};

/*-----------------------------------------------------------------------------------------------------------------------------*/
/* -------------------------------------------- controle de animação ------------------------------------------------- */
var animationLoop = function (callback, requestFrameFunction) {
  requestFrameFunction = requestFrameFunction || requestAnimationFrame;

  var previousFrameTime = window.performance.now();

  var animationSeconds = 0;

  var render = function () {
    var now = window.performance.now();
    var animationDelta = (now - previousFrameTime) / 1000;
    previousFrameTime = now;
    animationDelta = Math.min(animationDelta, 1 / 30);
    animationSeconds += animationDelta;

    callback(animationDelta, animationSeconds);

    requestFrameFunction(render);
  };

  requestFrameFunction(render);
};

/*
	function death(){
		runAnim =false;
		$(renderer.domElement).fadeOut();
		$('#gameCanvas').css({display: 'none'});
		$('body').append('<div id="dead" style="position: fixed; display: block; color: #666666; text-align: center; font-size: 32px"> </div>');
		$('#death').html('GAME OVER <br/> pontos: ' + score + '; <br/> recarregue a página para tentar novamente;');
	}*/

/* ----------------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------------ "MAIN" --------------------------------------------------------- */

var main = function () {
  var pilulas_comuns_engolidas = 0;
  var pilulas_especiais_engolidas = 0;
  var renderer = criar_Renderer();
  var cena = criar_cena();
  var mapa = criar_mapa(cena, LEVEL);

  var camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    100000
  );
  camera.up.copy(UP);
  camera.targetPosition = new THREE.Vector3();
  camera.targetLookAt = new THREE.Vector3();
  camera.lookAtPosition = new THREE.Vector3();
  var keys = createKeyState(camera); // retorna o estado do teclado

  //var hudCamera = createHudCamera(mapa);

  var pacman = criar_pacman(cena, mapa.pacmanSpawn);

  pauseOrbit = new THREE.OrbitControls(camera);
  pauseOrbit.enableDamping = true;
  pauseOrbit.dampingFactor = 0.25;
  pauseOrbit.screenSpacePanning = false;
  pauseOrbit.minDistance = 100;
  pauseOrbit.maxPolarAngle = Math.PI;
  pauseOrbit.enabled = false;

  var fantasmaSpawnTime = -8;
  var numfantasmas = 0;

  var won = (lost = false);
  var lostTime, wonTime;

  var chompSound = new Audio("sons/pilula.wav");
  chompSound.volume = 0.5;
  chompSound.loop = true;
  chompSound.preload = "auto";

  var levelStartSound = new Audio("sons/pacman_beginning.mp3");
  levelStartSound.preload = "auto";

  levelStartSound.autoplay = true;

  var deathSound = new Audio("sons/morto.wav");
  deathSound.preload = "auto";

  var killSound = new Audio("sons/mata_fantasma.wav");
  killSound.preload = "auto";

  var remove = [];

  lives = 3;
  var livesContainer = document.getElementById("lives");

  for (var i = 0; i < lives; i++) {
    var life = document.createElement("img");
    life.src = "pacman.png";
    life.className = "life";

    livesContainer.appendChild(life);
  }

  /* ---------------------------------------  UPDATES ----------------------------------*/
  var update = function (delta, now) {
    if (camera_player == true) {
      updateCamera(delta, now);
    }

    updatePacman(delta, now);

    cena.children.forEach(function (object) {
      if (object.isfantasma === true) updatefantasma(object, delta, now);
      if (object.isWrapper === true) wrapObject(object, mapa);
      if (object.isTemporary === true && now > object.removeAfter)
        remove.push(object);
    });

    remove.forEach(cena.remove, cena);
    for (item in remove) {
      if (remove.hasOwnProperty(item)) {
        cena.remove(remove[item]);
        delete remove[item];
      }
    }

    if (numfantasmas < 4 && now - fantasmaSpawnTime > 8) {
      criar_fantasma(cena, mapa.fantasmaSpawn);
      numfantasmas += 1;
      fantasmaSpawnTime = now;
    }
  };
  /*--------------------------------------------------------------------------------*/

  var _diff = new THREE.Vector3();
  var showText = function (message, size, now) {
    var textMaterial = new THREE.MeshPhongMaterial({ color: "red" });

    var textGeometry = new THREE.TextGeometry(message, {
      size: size,
      height: 0.05,
      font: "Helvetiker",
    });

    var text = new THREE.Mesh(textGeometry, textMaterial);

    text.position.copy(pacman.position).add(UP);

    text.up.copy(pacman.direction);
    text.lookAt(text.position.clone().add(UP));

    text.isTemporary = true;
    text.removeAfter = now + 3;

    cena.add(text);

    return text;
  };

  var updatePacman = function (delta, now) {
    if (!won && !lost && (keys["W"] || keys["S"])) {
      chompSound.play();
    } else {
      chompSound.pause();
    }

    if (!won && !lost) {
      movePacman(delta);
    }

    if (!won && pilulas_comuns_engolidas === mapa.pilulas_comuns) {
      won = true;
      wonTime = now;
      levelStartSound.play();
    }

    if (won && now - wonTime > 3) {
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
    }

    if (lives > 0 && lost && now - lostTime > 4) {
      lost = false;
      pacman.position.copy(mapa.pacmanSpawn);
      pacman.direction.copy(esquerda);
      pacman.distanceMoved = 0;
    }

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

  var _lookAt = new THREE.Vector3();
  var movePacman = function (delta) {
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

  var updateCamera = function (delta, now) {
    if (won) {
      camera.targetPosition.set(mapa.centerX, mapa.centerY, 30);
      camera.targetLookAt.set(mapa.centerX, mapa.centerY, 0);
    } else if (lost) {
      camera.targetPosition = pacman.position.clone().addScaledVector(UP, 4);
      camera.targetLookAt = pacman.position
        .clone()
        .addScaledVector(pacman.direction, 0.01);
    } else {
      camera.targetPosition
        .copy(pacman.position)
        .addScaledVector(UP, 1.5)
        .addScaledVector(pacman.direction, -1);
      camera.targetLookAt.copy(pacman.position).add(pacman.direction);
    }

    var cameraSpeed = lost || won ? 1 : 10;
    camera.position.lerp(camera.targetPosition, delta * cameraSpeed);
    camera.lookAtPosition.lerp(camera.targetLookAt, delta * cameraSpeed);
    camera.lookAt(camera.lookAtPosition);
  };

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
          //death();
          window.alert(
            "fim de jogo; pontuacao: " +
              score +
              "recarregue a pagina para tentar novamente;"
          );
        }
      }
    }
  };

  var movefantasma = (function () {
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
  })();
  /*if (!lost && !won){
		if (pilulas_comuns_engolidas > 0){
			score += 10 ;
		} 
		if (pilulas_especiais_engolidas > 0) {
			score += 100;
		}
		
		document.getElementById("scores").innerHTML = score;
	}	*/
  if (runAnim) {
    animationLoop(function (delta, now) {
      if (!paused) {
        update(delta, now);
      } else {
        pauseOrbit.update();
      }
      renderer.setViewport(
        0,
        0,
        renderer.domElement.width,
        renderer.domElement.height
      );

      if (lightChanged) {
        if (lightOnOff == false) {
          cena.add(light);
        } else {
          cena.remove(light);
        }
        lightChanged = false;
      }

      camera2(camera, pacman);
      //camera.lookAt(pacman.position);
      renderer.render(cena, camera);
      //renderHud(renderer, hudCamera, cena);
    });
  }
};

function startGame() {
  paused = false;
  main();
}

/* ----------------------------------------------------------------------------------------------------------------------------- */
