/* -------------------------------------------- controle de estado do teclado ------------------------------------------------- */

function togglePause(cam) {
  if (!paused) {
    paused = true;
    defaultCamera[0] = cam.position.x;
    defaultCamera[1] = cam.position.y;
    defaultCamera[2] = cam.position.z;
    pauseOrbit.enabled = true;
    pauseOrbit.reset();
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
