function mainController($scope, socket) {
    //  ---------------------------EMIT EVENTS HERE--------------------------------------------
    /**
     *
     */
    socket.on('connect', function () {
        //emit newUser event so that client info is stored
        console.log('io connection establised.');
        //.... more functionality goes
    });

    /**
     * Roll the dice if turn is equal to the player number assigned to the player.
     */

    $scope.rollTheDice = function () {
          if ($scope.game.rollTurn != $scope.playerNumber) {
            $scope.message = "It is not your turn.";
            return;
        }

        if ($scope.game.rollTurn != $scope.game.turn) {
            $scope.message = "Wait for your turn first";
            return;
        }

        socket.emit('rollDice', $scope.gameId);

    }

    /**
     * Function emit the walk event given the player number and coin number.
     * It internally uses two more variables, $scope.game.lastDiceValues and $scope.gameId to emit walk event
     * to the server.
     *
     * @param playerNumber
     * @param coinNumber
     */
    $scope.emitWalk = function (playerNumber, coinNumber) {

         if ($scope.playerNumber != playerNumber) {
            $scope.message = "It is not your coin.";
            return;
        }
         if ($scope.game.turn != playerNumber) {
            $scope.message = "It is not your turn.";
            return;
        }

        if ($scope.game.rollTurn === $scope.game.turn) {
            $scope.message = "First complete your rolls.";
            return;
        }

        var diceValue = $scope.selectedValue;
        if (!diceValue) {
            $scope.message = 'Please select a dice value to walk the coin.';
            return;
        }
        console.log("emitting emitWalk with values" + playerNumber + coinNumber + diceValue);
        var currentPosition = $scope.game.players[playerNumber].coins[coinNumber].position;
        if (currentPosition === -1) {
            if (diceValue == 6) {
                $scope.message = "Opening ... ";
                socket.emit('openCoin', {
                    gameId: $scope.gameId,
                    playerNumber: playerNumber,
                    coinNumber: coinNumber
                })
            } else {
                $scope.message = 'Coin can be open only on 6';
                return;
            }

        } else {
            $scope.message = "Walking coin ... " + diceValue;
            socket.emit('walk', {
                gameId: $scope.gameId,
                playerNumber: playerNumber,
                coinNumber: coinNumber,
                numberOfSteps: diceValue
            });
        }

    }

    /**
     * Emit  a event to create a new game
     */
    $scope.createNewGame = function () {
        console.log("Ok, let's create a new game.");
        socket.emit('createGame');

    }

    /**
     * Emit a event to join a already created game.
     */
    $scope.joinGame = function () {
        $scope.gameId = prompt("Enter the gameId  : ", "1");
        socket.emit('joinGame', $scope.gameId);

    }

    /**
     * Emit a event to reconnect to a game.
     */
    $scope.reconnectToGame = function () {
        $scope.gameId = prompt("Enter the gameId  : ", "Game ID");
        $scope.playerNumber = prompt("Enter your PlayerNumber  : ", "Player Number");
        socket.emit('reconnectToGame', {
            gameId: $scope.gameId,
            playerNumber: $scope.playerNumber
        });

    }


    // ------------------------------------------------CATCH EVENTS HERE---------------------------------------------
    /**
     * Do this when server emit 'rollDiceSuccess' event.
     */
    socket.on('rollDiceSuccess', function (data) {
        if (data.gameId != $scope.gameId)
            return;
        $scope.game = data.game;
        console.log($scope.game)
        var turn = $scope.game.turn;
        $scope.selectedValue = $scope.game.players[turn].diceValues[0];
        console.log("selected value set to " + $scope.selectedValue);
    })

    /**
     *Do this when server emits 'createGameSuccess' event.
     */
    socket.on('createGameSuccess', function (data) {

        //$window.location.href = '/ludo';
        console.log("player Number >>> :" + data.playerNumber);
        $scope.gameId = data.gameId;
        $scope.game = data.game;
        $scope.playerNumber = data.playerNumber;
        socket.emit('registerPlayer', {
            gameId: $scope.gameId,
            playerNumber: $scope.playerNumber
        });
    })


    socket.on('GameFull', function (data) {
        prompt("Game is full, Please create a  new game : ");
    })


    socket.on('JoinGameFailure', function (data) {
        prompt("No such game exists. with gameId :" + data.gameID);
    })


    socket.on('update', function (data) {
        console.log("game Id :" + data.gameId + ".");
        console.log("scope game Id :" + $scope.gameId + ".");

        if (data.gameId != $scope.gameId)
            return;

        console.log('Id matched : ' + data.gameId);
        $scope.game = data.game;

        console.log("Updating !! data returned: " + JSON.stringify(data));
        // $scope.walkCoin(data.playerNumber, data.coinNumber, data.position);
        $scope.update();
        var turn = $scope.game.turn;
        $scope.selectedValue = $scope.game.players[turn].diceValues[0];
        console.log("selected value set to " + $scope.selectedValue);
    })

    socket.on('clearScreen', function (data) {
        $scope = {};
        console.log('screen cleared');
    })


// ------------------------------------------------------------General  Methods ------------------------------------
    $scope.pageOpenFunction = function (data) {
        if (!$scope.gameId) {
            $scope.gameId = prompt("Enter the gameId  : ", "1");
            $scope.createGame();
        }
    };

    // $scope.pageOpenFunction();


    $scope.update = function () {

        $scope.game.players.forEach(function (player, playerIndex) {
            player.coins.forEach(function (coin, coinIndex) {
                var position = coin.position;
                var coinId = "coin" + playerIndex + coinIndex;
                var boxId = "ludo" + position;
                if (position === -1) {
                    boxId = document.getElementById(coinId).getAttribute('start');
                }
                if (position === 1000) {
                    boxId = 'success';
                }
                //console.log("position is " + position);
                //console.log("box id  is  :" + boxId);
                //console.log("coin id is : " + coinId);
                var box = document.getElementById(boxId);
                var coin = document.getElementById(coinId);
                box.appendChild(coin);

            })
        })
    }


    /**
     * Function return an array of num length having elements starting from 0 to length.
     *
     * @param num
     * @returns {Array}
     */
    $scope.getArray = function (num) {
        var arr = new Array(num);
        for (var i = 0; i < num; i++) {
            arr[i] = i;
        }
        return arr;
    }


    $scope.table1 = [
        [6, 524, 46],
        [5, 523, 47],
        [4, 522, 48],
        [3, 521, 49],
        [2, 520, 50],
        [1, 52, 51]

    ];

    $scope.table2 = [
        [14, 15, 16, 17, 18, 19],
        [13, 130, 131, 132, 133, 134],
        [12, 11, 10, 9, 8, 7]
    ];

    $scope.table3 = [
        [25, 26, 27],
        [24, 260, 28],
        [23, 261, 29],
        [22, 262, 30],
        [21, 263, 31],
        [20, 264, 32]

    ];


    $scope.table4 = [
        [33, 34, 35, 36, 37, 38],
        [394, 393, 392, 391, 390, 39],
        [45, 44, 43, 42, 41, 40]
    ];

}
