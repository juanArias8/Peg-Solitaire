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
    var prohibited = [0, 1, 5, 6, 7, 8, 12, 13, 35, 36, 40, 41, 42, 43, 47, 48];

    var onGame = false;
    var onCustomise = false;


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
            let id = $(this).attr("id");
            let str = "#" + id;
            let coordinates = getCoordinatesById(id);
            matrixCustomisable[coordinates[0]][coordinates[1]] = 1;
            $(str).css("background-color", "green");
        } else if(onGame){
            let id = $(this).attr("id");
            let str = "#" + id;
            let coordinates = getCoordinatesById(id);
            matrixCustomisable[coordinates[0]][coordinates[1]] = 2;
            $(str).css("background-color", "red");
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

    /* Condiciones iniciales de las fichas
    data = [
        { "id": 3, "selected": false, "removed": false, "position": [0, 2] },
        { "id": 4, "selected": false, "removed": false, "position": [0, 3] },
        { "id": 5, "selected": false, "removed": false, "position": [0, 4] },
        { "id": 10, "selected": false, "removed": false, "position": [1, 2] },
        { "id": 11, "selected": false, "removed": false, "position": [1, 3] },
        { "id": 12, "selected": false, "removed": false, "position": [1, 4] },
        { "id": 15, "selected": false, "removed": false, "position": [2, 0] },
        { "id": 16, "selected": false, "removed": false, "position": [2, 1] },
        { "id": 17, "selected": false, "removed": false, "position": [2, 2] },
        { "id": 18, "selected": false, "removed": false, "position": [2, 3] },
        { "id": 19, "selected": false, "removed": false, "position": [2, 4] },
        { "id": 20, "selected": false, "removed": false, "position": [2, 5] },
        { "id": 21, "selected": false, "removed": false, "position": [2, 6] },
        { "id": 22, "selected": false, "removed": false, "position": [3, 0] },
        { "id": 23, "selected": false, "removed": false, "position": [3, 1] },
        { "id": 24, "selected": false, "removed": false, "position": [3, 2] },
        { "id": 25, "selected": false, "removed": true, "position": [3, 3] },
        { "id": 26, "selected": false, "removed": false, "position": [3, 4] },
        { "id": 27, "selected": false, "removed": false, "position": [3, 5] },
        { "id": 28, "selected": false, "removed": false, "position": [3, 6] },
        { "id": 28, "selected": false, "removed": false, "position": [4, 0] },
        { "id": 30, "selected": false, "removed": false, "position": [4, 1] },
        { "id": 31, "selected": false, "removed": false, "position": [4, 2] },
        { "id": 32, "selected": false, "removed": false, "position": [4, 3] },
        { "id": 33, "selected": false, "removed": false, "position": [4, 4] },
        { "id": 34, "selected": false, "removed": false, "position": [4, 5] },
        { "id": 35, "selected": false, "removed": false, "position": [4, 6] },
        { "id": 38, "selected": false, "removed": false, "position": [5, 2] },
        { "id": 39, "selected": false, "removed": false, "position": [5, 3] },
        { "id": 40, "selected": false, "removed": false, "position": [5, 4] },
        { "id": 43, "selected": false, "removed": false, "position": [6, 2] },
        { "id": 44, "selected": false, "removed": false, "position": [6, 3] },
        { "id": 45, "selected": false, "removed": false, "position": [6, 4] },
    ];*/

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
        let possibles = [];
        if (matrix[i - 2][j] != undefined && matrix[i - 2][j] == 2) {
            possibles.push([i - 2, j]);
        }
        if (matrix[i][j - 2] != undefined && matrix[i][j - 2] == 2) {
            possibles.push([i, j - 2]);
        }
        if (matrix[i][j + 2] != undefined && matrix[i][j + 2] == 2) {
            possibles.push([i, j + 2]);
        }
        if (matrix[i + 2][j] != undefined && matrix[i + 2][j] == 2) {
            possibles.push([i + 2, j]);
        }
        return possibles;
    }

    function changeEmptyByFull(id1, id2) {
        let coordinatesId1 = getCoordinatesById(id1);
        let coordinatesId2 = getCoordinatesById(id2);
        matrix[coordinatesId1[0]][coordinatesId1[1]] = 1;
        matrix[coordinatesId2[0]][coordinatesId2[1]] = 2;
    }

    function deleteMiddleFullEmpty(id1, id2) {
        let coordinatesId1 = getCoordinatesById(id1);
        let coordinatesId2 = getCoordinatesById(id2);
        let i1 = coordinatesId1[0];
        let j1 = coordinatesId1[1];
        let i2 = coordinatesId2[0];
        let j2 = coordinatesId2[1];
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
        matrix[ifinal][jfinal] = 2;
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

    function startGame() {
        console.log("game started");
    }
});