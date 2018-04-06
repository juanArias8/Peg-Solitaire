$(document).ready(function () {

    /*****************************************************************
    ********************* INITIAL CONDITIONS *************************
    ******************************************************************/

    /**
     * 0 ==> prohibited cell
     * 1 ==> Full cell
     * 2 ==> Empty cell
     */
    var matrix = [
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 2, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 0, 0]
    ];

    var matrixCustomisable = [
        [0, 0, 2, 2, 2, 0, 0],
        [0, 0, 2, 2, 2, 0, 0],
        [2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2],
        [0, 0, 2, 2, 2, 0, 0],
        [0, 0, 2, 2, 2, 0, 0]

    ];

    var rows = matrix.length;
    var cols = matrix[0].length;
    //var prohibited = [0, 1, 5, 6, 7, 8, 12, 13, 35, 36, 40, 41, 42, 43, 47, 48];

    var onGame = false;
    var onCustomise = false;

    var move = [];
    let possibles = [];

    /*****************************************************************
    ************************ VISUAL LOGIC ****************************
    ******************************************************************/

    // Materialize events
    //$('.modal').modal();
    //$('#modal1').modal('open');

    // Ocultamos el cuerpo del juego
    $("#game-body").hide(0);
    $("#btn-fin-cus").hide(0);
    $("#btn-fin-game").hide(0);
    $("#btn-show-game").hide(0);

    $("#btn-ori").click(function () {
        Materialize.toast('El juego ha sido iniciado', 5000, 'rounded');
        $("#btn-cus").hide(0);
        $("#btn-ori").hide(0);
        $("#btn-fin-game").show(0);
        $("#game-body").show("slow");
        $("#btn-show-game").show(0);

        onGame = true;
        paintGame();
    });

    $("#btn-cus").click(function () {
        Materialize.toast('Seleccione sólo las fichas que estarán llenas', 5000, 'rounded');
        $("#btn-ori").hide(0);
        $("#btn-cus").hide(0);
        $("#btn-fin-cus").show(0);
        $("#game-body").show("slow");

        onCustomise = true;
    });

    $(".btn-peg").click(function () {
        if (onCustomise) {
            $(this).css("background-color", "green");

            let id = $(this).attr("id");
            let coordinates = getCoordinatesById(id);
            matrixCustomisable[coordinates[0]][coordinates[1]] = 1;
        } else if (onGame) {
            let id = $(this).attr("id");
            if (move.length == 0) {
                let coordinates = getCoordinatesById(id);
                if (matrix[coordinates[0]][coordinates[1]] == 1) {
                    $(this).css("background-color", "aqua");

                    possibles = searchMovement(coordinates[0], coordinates[1]);
                    if (possibles.length > 0) {
                        colorPossibles("blue");
                        move.push(parseInt(id));
                    } else {
                        Materialize.toast('La opción seleccionada no tiene posibles movimientos', 5000, 'rounded');
                        $(this).css("background-color", "green");
                    }
                } else {
                    Materialize.toast('Debes seleccionar una opción válida', 5000, 'rounded');
                }
            } else if (move.length == 1) {
                move.push(parseInt(id));

                if (possibles.indexOf(move[1]) != -1) {
                    if (checkMiddleFullEmpty(move[0], move[1])) {
                        Materialize.toast('Bien hecho!', 5000, 'rounded');

                        changeEmptyByFull(move[0], move[1]);
                        deleteMiddleFullEmpty(move[0], move[1]);
                        paintGame();
                        resetMove();
                    } else {
                        Materialize.toast('Movimiento no valido, no hay nada que eliminar', 5000, 'rounded');
                        colorPossibles("white");
                        unsealSelected();
                        resetMove();
                    }

                } else {
                    Materialize.toast('Movimiento no valido', 5000, 'rounded');
                    colorPossibles("white");
                    unsealSelected();
                    resetMove();
                }
            } else {
                Materialize.toast('Ha ocurrido un error', 5000, 'rounded');
            }

        } else {
            Materialize.toast('Opción no permitida', 5000, 'rounded');
        }
    });

    $("#btn-fin-cus").click(function () {
        Materialize.toast('El juego ha sido iniciado', 5000, 'rounded');
        $("#btn-fin-cus").hide(0);
        $("#btn-fin-game").show(0);
        $("#btn-show-game").show(0);

        matrix = matrixCustomisable;
        onCustomise = false;
        onGame = true;
        paintGame();
    });

    $("#btn-fin-game").click(function () {
        Materialize.toast('El juego ha sido terminado', 5000, 'rounded');
        $("#btn-cus").show(0);
        $("#btn-ori").show(0);
        $("#btn-fin-game").hide(0);
        $("#btn-show-game").hide(0);
        $("#game-body").hide("slow");

        onGame = false;
        onCustomise = false;
        resetMatrix();
        resetMatrixCustomisable();
        unsealGame();
    });

    /*****************************************************************
    ************************* GAME LOGIC *****************************
    ******************************************************************/

    function paintGame() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let id = getIdByCoordinates(i, j, cols);
                let str = "#" + id;
                if (matrix[i][j] == 0) {
                    continue;
                } else if (matrix[i][j] == 1) {
                    $(str).css("background-color", "green");
                } else if (matrix[i][j] == 2) {
                    $(str).css("background-color", "white");
                }
            }
        }
    }

    function unsealGame() {
        $(".btn-peg").each(function () {
            $(this).css("background-color", "white");
        });
    }

    function colorPossibles(color) {
        possibles.forEach(element => {
            let aux = getCoordinatesById(element);
            let i = aux[0];
            let j = aux[1];
            let id = getIdByCoordinates(i, j);
            let str = "#" + id;
            $(str).css("background-color", color);
        });
    }

    function unsealSelected() {
        let id = move[0];
        let str = "#" + id;
        $(str).css("background-color", "green");
    }

    function resetMove() {
        possibles = [];
        move = [];
    }

    function getIdByCoordinates(i, j) {
        let id = (rows * i) + j;
        return id;
    }

    function getCoordinatesById(id) {
        let coordinates = [];
        i = Math.floor(id / rows);
        j = (id % cols);
        coordinates = [i, j];
        return coordinates;
    }

    function searchMovement(i, j) {
        let possiblesLocal = [];
        try {
            if (matrix[i - 2][j] == 2) {
                let id = getIdByCoordinates(i - 2, j);
                possiblesLocal.push(id);
            }
        } catch (err) {
            // pass
        }
        try {
            if (matrix[i][j - 2] == 2) {
                let id = getIdByCoordinates(i, j - 2);
                possiblesLocal.push(id);
            }
        } catch (err) {
            // pass
        }
        try {
            if (matrix[i][j + 2] == 2) {
                let id = getIdByCoordinates(i, j + 2);
                possiblesLocal.push(id);
            }
        } catch (err) {
            // pass
        }
        try {
            if (matrix[i + 2][j] == 2) {
                let id = getIdByCoordinates(i + 2, j);
                possiblesLocal.push(id);
            }
        } catch (err) {
            // pass
        }
        return possiblesLocal;
    }

    function changeEmptyByFull(id1, id2) {
        let coordinatesId1 = getCoordinatesById(id1);
        let coordinatesId2 = getCoordinatesById(id2);
        matrix[coordinatesId1[0]][coordinatesId1[1]] = 2;
        matrix[coordinatesId2[0]][coordinatesId2[1]] = 1;
    }

    function deleteMiddleFullEmpty(id1, id2) {
        let coordinatesId1 = getCoordinatesById(id1);
        let coordinatesId2 = getCoordinatesById(id2);
        let i1 = coordinatesId1[0];
        let j1 = coordinatesId1[1];
        let i2 = coordinatesId2[0];
        let j2 = coordinatesId2[1];
        let middleCoordinates = findMiddleFullEmpty(i1, j1, i2, j2);
        matrix[middleCoordinates[0]][middleCoordinates[1]] = 2;
    }

    function findMiddleFullEmpty(i1, j1, i2, j2) {
        let middle = [];
        let ifinal = 0;
        let jfinal = 0;
        if ((i1 - i2) == 0) {
            let aux = Math.min(j1, j2);
            ifinal = i1;
            jfinal = aux + 1;
        }
        if ((j1 - j2) == 0) {
            let aux = Math.min(i1, i2);
            ifinal = aux + 1;
            jfinal = j1;
        }
        middle.push(ifinal);
        middle.push(jfinal);
        return middle;
    }

    function checkMiddleFullEmpty(id1, id2) {
        let bool = false;
        let coordinatesId1 = getCoordinatesById(id1);
        let coordinatesId2 = getCoordinatesById(id2);
        let i1 = coordinatesId1[0];
        let j1 = coordinatesId1[1];
        let i2 = coordinatesId2[0];
        let j2 = coordinatesId2[1];
        let middleCoordinates = findMiddleFullEmpty(i1, j1, i2, j2);
        let im = middleCoordinates[0];
        let jm = middleCoordinates[1];
        if (matrix[im][jm] == 1) {
            bool = true;
        }
        return bool;
    }

    // Función para volver los datos a las condiciones iniciales
    function resetMatrix() {
        matrix = [
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 2, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0]
        ];
    }

    function resetMatrixCustomisable() {
        matrixCustomisable = [
            [0, 0, 2, 2, 2, 0, 0],
            [0, 0, 2, 2, 2, 0, 0],
            [2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2],
            [0, 0, 2, 2, 2, 0, 0],
            [0, 0, 2, 2, 2, 0, 0]

        ];
    }
});