(function () {

    // var c = document.getElementById("gameCanvas");
    // c.appendChild(renderer.domElement);
	var lightOn = false;
    var PACMAN_SPEED = 2, PACMAN_RADIUS = 0.25;
    var fantasma_SPEED = 1.5, fantasma_RADIUS = PACMAN_RADIUS * 1.25;
    var pilulas_comuns_RADIUS = 0.05, pilulas_especiais_RADIUS = pilulas_comuns_RADIUS * 2;
    var UP = new THREE.Vector3(0, 0, 1);
    var esquerda = new THREE.Vector3(-1, 0, 0);
    var topo = new THREE.Vector3(0, 1, 0);
    var direita = new THREE.Vector3(1, 0, 0);
    var baixo = new THREE.Vector3(0, -1, 0);
    var LEVEL = [
        '# # # # # # # # # # # # # # # # # # # # # # # # # # # #',
        '# . . . . . . . . . . . . # # . . . . . . . . . . . . #',
        '# . # # # # . # # # # # . # # . # # # # # . # # # # . #',
        '# o # # # # . # # # # # . # # . # # # # # . # # # # o #',
        '# . # # # # . # # # # # . # # . # # # # # . # # # # . #',
        '# . . . . . . . . . . . . . . . . . . . . . . . . . . #',
        '# . # # # # . # # . # # # # # # # # . # # . # # # # . #',
        '# . # # # # . # # . # # # # # # # # . # # . # # # # . #',
        '# . . . . . . # # . . . . # # . . . . # # . . . . . . #',
        '# # # # # # . # # # # #   # #   # # # # # . # # # # # #',
        '          # . # # # # #   # #   # # # # # . #          ',
        '          # . # #         G           # # . #          ',
        '          # . # #   # # # # # # # #   # # . #          ',
        '# # # # # # . # #   #             #   # # . # # # # # #',
        '            .       #             #       .            ',
        '# # # # # # . # #   #             #   # # . # # # # # #',
        '          # . # #   # # # # # # # #   # # . #          ',
        '          # . # #                     # # . #          ',
        '          # . # #   # # # # # # # #   # # . #          ',
        '# # # # # # . # #   # # # # # # # #   # # . # # # # # #',
        '# . . . . . . . . . . . . # # . . . . . . . . . . . . #',
        '# . # # # # . # # # # # . # # . # # # # # . # # # # . #',
        '# . # # # # . # # # # # . # # . # # # # # . # # # # . #',
        '# o . . # # . . . . . . . P   . . . . . . . # # . . o #',
        '# # # . # # . # # . # # # # # # # # . # # . # # . # # #',
        '# # # . # # . # # . # # # # # # # # . # # . # # . # # #',
        '# . . . . . . # # . . . . # # . . . . # # . . . . . . #',
        '# . # # # # # # # # # # . # # . # # # # # # # # # # . #',
        '# . # # # # # # # # # # . # # . # # # # # # # # # # . #',
        '# . . . . . . . . . . . . . . . . . . . . . . . . . . #',
        '# # # # # # # # # # # # # # # # # # # # # # # # # # # #'
            ];
	/* ----------------------------------------------------------------------------------------------------------------------------------- */
	
    /* -------------------------------------------------------------- CRIAÇÃO DO MAPA ---------------------------------------------------- */  
  var criar_mapa = function (cena, proporcao_labirinto) { 												// função que cria o mapa recebe como parâmetro a scene e a definição do nível(?)
        var mapa = {};																					// Cria variáveis locais: vetor mapa
		mapa.baixo = -(proporcao_labirinto.length - 1);													// Cria variáveis locais: mapa área inferior
        mapa.cima = 0;																					// Cria variáveis locais: mapa área superior
        mapa.esquerda = 0;																				// Cria variáveis locais: mapa área à esquerda
        mapa.direita = 0;																				// Cria variáveis locais: mapa área à direita 
        mapa.pilulas_comuns = 0;																		// Cria variáveis locais: moedas/pilulas
        mapa.pacmanSpawn = null;
        mapa.fantasmaSpawn = null;

		var x, y;
        for (var linha = 0; linha <proporcao_labirinto.length; linha++) {								// delimitando as coordenadas do mapa
            y = -linha;
            mapa[y] = {};
            var length = Math.floor(proporcao_labirinto[linha].length / 2); 							// Obtém o comprimento da linha mais longa na definição de nível.
            mapa.direita = Math.max(mapa.direita, length);

            for (var coluna = 0; coluna < proporcao_labirinto[linha].length; coluna += 2) { 			// Salta cada segundo elemento, que é apenas um espaço para legibilidade.
                x = Math.floor(coluna / 2);
                var celula = proporcao_labirinto[linha][coluna];
                var object = null;
				
				if (celula === '#') {																	// aqui começa a criação de uma parede com a chamada de função da mesma 
                    object = criar_parede(); 															// """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""
                } else if (celula === '.') {															// aqui começa a criação das pílulas com a chamada de função da mesma 
                    object = criar_pilulas();															// """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""
                    mapa.pilulas_comuns += 1;															// """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""
                } else if (celula === 'o') {															// define o local das pílulas especiais 
                    object = criar_pilulas_especiais();													// """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""
                } else if (celula === 'P') {															// define o local de início do pacman 
                    mapa.pacmanSpawn = new THREE.Vector3(x, y, 0);										// """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""
                } else if (celula === 'G') {															// define o local de inicio dos fantasmas 
                    mapa.fantasmaSpawn = new THREE.Vector3(x, y, 0);										// """"""""""""""""""""""""""""""""""""""""""""""""""""""""""""
                }

                if (object !== null) {
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
	/* ----------------------------------------------------------------------------------------------------------------------------------- */
	/* -------------------------------------------------------------- CRIANDO PAREDES ---------------------------------------------------- */
	
	var getAt = function (mapa, posicao) {
        var x = Math.round(posicao.x), y = Math.round(posicao.y);
        return mapa[y] && mapa[y][x];
    }
	
	var parede = function (mapa, posicao) {																// função da parede
        var celula = getAt(mapa, posicao);													    		// a variável celula é utilizada para compor as paredes 
        return celula && celula.parede === true;														// do labirinto, desde que o local no map que define sua composição seja verdadeira 
    };
	
	var removeAt = function (mapa, cena, posicao) {
        var x = Math.round(posicao.x), y = Math.round(posicao.y);
        if (mapa[y] && mapa[y][x]) {
            mapa[y][x].visible = false;
        }
    }
	
	var criar_parede = function () {																	// variável que recebe a função de criar a parede
        var paredeGeometry = new THREE.BoxGeometry(1, 1, 1);											// cria um cubo 
        var paredeMaterial = new THREE.MeshLambertMaterial({ color: 'pink' });							// define a cor do cubo
	
		return function () {																			// função para criar a parede
            var labirinto = new THREE.Mesh(paredeGeometry, paredeMaterial);								// uma variável parede é criada e recebe a 'malha' definida anteriormente 
            labirinto.parede = true;																	// se os valores forem verdadeiros
            return labirinto;																			// retorna a parede 
        };
    }();
	/* ----------------------------------------------------------------------------------------------------------------------------------- */
	/* ------------------------------------------------------------ CRIANDO PÍLULAS ------------------------------------------------------ */
	
	  var criar_pilulas = function () {																	// variável que recebe a função de criar pílulas 
        var pilulas_comunsGeometry = new THREE.SphereGeometry(pilulas_comuns_RADIUS);					// cria a bolinha da pílula
        var pilulas_comunsMaterial = new THREE.MeshPhongMaterial({ color: 0xFFDAB9 }); 					// define a cor da mesma

        return function () {																			// função para criar a pílula
            var pilulas_comuns = new THREE.Mesh(pilulas_comunsGeometry, pilulas_comunsMaterial);		// recebe cada pílula criada 
            pilulas_comuns.pilulascomuns = true;														// se houver uma pílula criada 

            return pilulas_comuns; 																		// retorna cada pílula formando o caminho
        };
    }();
	
	/* ----------------------------------------------------------------------------------------------------------------------------------- */
	
	/* ------------------------------------------------------ CRIANDO PÍLULAS ESPECIAIS -------------------------------------------------- */
	
    var criar_pilulas_especiais = function() {																// variável que recebe a função de criar pílulas especiais
        var pilulas_especiaisGeometry = new THREE.SphereGeometry(pilulas_especiais_RADIUS, 12, 8);			// cria a bolinha da pílula
        var pilulas_especiaisMaterial = new THREE.MeshPhongMaterial({ color: 0xFFDAB9 }); 					// define a cor da mesma

        return function () {																				// função para criar a pílula especial
            var pilulas_especiais = new THREE.Mesh(pilulas_especiaisGeometry, pilulas_especiaisMaterial);	// recebe cada pílula criada
            pilulas_especiais.pilulasespeciais = true;														// se houver uma pílula criada

            return pilulas_especiais;																		// retorna cada pílula 
        };
    }();
	
	/* ----------------------------------------------------------------------------------------------------------------------------------- */
	
	/* -------------------------------------------------------------- CRIANDO CENA ------------------------------------------------------- */
     var criar_cena = function () {
        var cena = new THREE.Scene();

        // Add lighting
        cena.add(new THREE.AmbientLight(0x888888));
        var light = new THREE.SpotLight('white', 0.5);
        light.position.set(0, 0, 50);
        cena.add(light);

        return cena;
    };
	
	/* ----------------------------------------------------------------------------------------------------------------------------------- */
	
	
	/* ---------------------------------------------------------- RENDERIZAÇÃO ----------------------------------------------------------- */
	 
	 var criar_Renderer = function () {
        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor('black', 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        var c = document.getElementById("gameCanvas");
        c.appendChild(renderer.domElement);
        // document.body.appendChild(renderer.domElement);

        return renderer;
    }
	
	/* ----------------------------------------------------------------------------------------------------------------------------------- */
	
		/* -------------------------------------------------------------- Câmera ------------------------------------------------------- */
	 var createHudCamera = function (mapa) {
        var halfWidth = (mapa.direita - mapa.esquerda) / 2, halfHeight = (mapa.topo - mapa.baixo) / 2;
    };
					/* ------------------------------------------- Renderização da câmera ------------------------------------------*/
					
						var renderHud = function (renderer, hudCamera, scene) {
								scene.children.forEach(function (object) {
								if (object.parede !== true)
								object.scale.set(2.5, 2.5, 2.5);
								});

								renderer.enableScissorTest(true);
								renderer.setScissor(10, 10, 200, 200);
								renderer.setViewport(10, 10, 200, 200);
								renderer.render(scene, hudCamera);
								renderer.enableScissorTest(false);

								scene.children.forEach(function (object) {
									object.scale.set(1, 1, 1);
								});
						};
	/* ----------------------------------------------------------------------------------------------------------------------------- */
	/* ---------------------------------------------------- CRIANDO O PAC-MAN ------------------------------------------------------ */
	var criar_pacman = function () {
        var pacmanGeometries = [];
        var numFrames = 40;
        var offset;
        for (var i = 0; i < numFrames; i++) {
            offset = (i / (numFrames - 1)) * Math.PI;
            pacmanGeometries.push(new THREE.SphereGeometry(PACMAN_RADIUS, 16, 16, offset, Math.PI * 2 - offset * 2));
            pacmanGeometries[i].rotateX(Math.PI / 2);
        }

        var pacmanMaterial = new THREE.MeshPhongMaterial({ color: 'yellow', side: THREE.DoubleSide });

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
    }();
	/* ----------------------------------------------------------------------------------------------------------------------------- */
	
	/* ------------------------------------------------- CRIANDO OS FANTASMAS ------------------------------------------------------ */
	
   var criar_fantasma = function () {
        var fantasmaGeometry = new THREE.SphereGeometry(fantasma_RADIUS, 16, 16);

        return function (cena, posicao) {
            var fantasmaMaterial = new THREE.MeshPhongMaterial({ color: 'blue' });
            var fantasma = new THREE.Mesh(fantasmaGeometry, fantasmaMaterial);
            fantasma.isfantasma = true;
            fantasma.isWrapper = true;
            fantasma.isAfraid = false;

            fantasma.position.copy(posicao);
            fantasma.direction = new THREE.Vector3(-1, 0, 0);

            cena.add(fantasma);
        };
    }();
	
	var wrapObject = function (object, mapa) {
        if (object.position.x < mapa.esquerda)
            object.position.x = mapa.direita;
        else if (object.position.x > mapa.direita)
            object.position.x = mapa.esquerda;

        if (object.position.y > mapa.topo)
            object.position.y = mapa.baixo;
        else if (object.position.y < mapa.baixo)
            object.position.y = mapa.topo;
    };
	
	/* ----------------------------------------------------------------------------------------------------------------------------- */
	
	/* --------------------------------------------- PARTE GENÉRICA DO CÓDIGO ------------------------------------------------------ */
	/* ---------------------------------------------------- distância  ------------------------------------------------------------- */
	var distance = function () { 																		// variável que a função que calcula a distância entre 2 componentes
        var difference = new THREE.Vector3(); 															// variável: novo objeto 3d que representa a diferença das distâncias 

        return function (object1, object2) { 															// retorno de 2 objetos
            difference.copy(object1.position).sub(object2.position);									// Calcula a diferença entre as posições dos objetos.

            return difference.length();																	// retorna o tamanho máximo da diferença de posições dos objetos em questão
        };
    }();

    /*-----------------------------------------------------------------------------------------------------------------------------*/
}