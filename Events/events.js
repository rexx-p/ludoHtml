var Player = require('../ludo/Player')
var Game = require('../ludo/Game')
var games = [];

var player = new Player();
var myEvents = function (io) {

    /**
     * This is the function which can be used to perform anything to socket when it gets created.
     */
    io.sockets.on('connection', function (socket) {
        // every connection will create a socket
        socket.on('registerPlayer', function (data) {
            socket.playerNumber = data.playerNumber;
            socket.gameId = data.gameId;// socket stores the username
            console.log("Player number "+data.playerNumber+" connected to game with game ID :"+data.gameId);
        });


        socket.on('disconnect', function () {
            console.log("Player number disconnected: " + socket.playerNumber+" for game Id : "+socket.gameId); // retrieve it from socket object
        });
        // more functionality goes...
    });

    /**
     * All other things which happen after connection goes here.
     */
    io.on('connection', function (socket) {
        console.log("user connected.");
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });

        /**
         * Catch roll dice event.
         */
        socket.on('rollDice', function (gameId) {
            var game = games[gameId];
            if(!game){
                socket.emit('clearScreen',"");
                return;
            }
            game.rollDice();
            io.emit('rollDiceSuccess', {
                gameId: gameId,
                game: game
            });
            io.emit('update', {
                gameId: gameId,
                game: game
            });


        })

        socket.on('walk', function (data) {
            console.log("Got data" + JSON.stringify(data));
            var gameId = Number(data.gameId);
            var game = games[data.gameId];
            var playerNumber = Number(data.playerNumber);
            var coinNumber = Number(data.coinNumber);
            game.walk(playerNumber, coinNumber, Number(data.numberOfSteps));

            io.emit('update', {
                gameId: gameId,
                game: game,
            });
        });

        socket.on('openCoin', function (data) {

            var gameId = Number(data.gameId);
            var game = games[data.gameId];
            var playerNumber = Number(data.playerNumber);
            var coinNumber = Number(data.coinNumber);
            game.open(Number(playerNumber), Number(coinNumber));

            io.emit('update', {
                gameId: gameId,
                game: game,
            });
        });

        socket.on('nextTurn', function (data) {
            console.log("server nextTurn event called.");
           // console.log("Got data for next turn" + JSON.stringify(data));
            var gameId = Number(data.gameId);
            var game = games[data.gameId];

            game.nextTurn();

            io.emit('update', {
                gameId: gameId,
                game: game,
            });
        });

        /**
         * What we do to while creating a new game
         */
        socket.on('createGame', function () {
            var gameId = games.length+1;
            games[gameId] = new Game(4);
            socket.emit('createGameSuccess', {
                gameId: gameId,
                playerNumber: 0,
                game: games[gameId],
                status: 1

            });

            console.log('Game created with id' + gameId);

        });

        /**
         * What we do when a user join a already created game
         */
        socket.on('joinGame', function (gameId) {
            if(!gameId){
               console.log('Cannot join game without specifying game ID. ');
                  socket.emit('joinGameFailure',{
                      gameId :null
                  })
            }
            var game = games[gameId];
            if(!game){
                console.log('No game has been created yet with game Id ${gameId}');
                socket.emit('joinGameFailure',{
                    gameId :gameId
                })
            }
            if (game.playersJoined < 4) {
                game.playersJoined++;
                socket.emit('createGameSuccess', {
                    gameId: gameId,
                    playerNumber: game.playersJoined - 1,
                    game: games[gameId],
                    status: 1
                });
            } else {
                socket.emit('joinGameFailure', {
                    gameId: gameId,
                    status: 0
                })
            }
            io.emit('update', {
                gameId: gameId,
                game: game
            });
        });

        /**
         * What we do when a user reconnect to already going On game
         */
        socket.on('reconnectToGame', function (data) {
            var gameId = data.gameId;
            var playerNumber = data.playerNumber;
            var game = games[gameId];
            socket.emit('createGameSuccess', {
                gameId: gameId,
                playerNumber: playerNumber,
                game: game,
                status: 1
            });
            io.emit('update', {
                gameId: gameId,
                game: game
            });
        });


    })
}

module.exports = myEvents;



