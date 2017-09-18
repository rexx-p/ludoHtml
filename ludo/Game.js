var Player = require('./Player')
"use strict";

class Game {


    constructor(numberOfPlayers) {
        var startPositions = [2, 15, 28, 41];
        var endPositions = [52, 13, 26, 39];
        this.players = [];
        for (var i = 0; i < numberOfPlayers; i++) {
            this.players.push(new Player(startPositions[i], endPositions[i]));
        }
        this.gameOver = false;
        this.rollTurn = 0;
        this.turn = 0;
        this.lastDiceValue = 0;
        this.playersJoined = 1;
    }

    open(playerNumber, coinNumber) {
        this.players[playerNumber].open(coinNumber);
        this.conditionalNextTurn();
    }


    walk(playerNumber, coinNumber, steps) {
        if (this.rollTurn === playerNumber) {
            console.log("complete your rolls first.");
            return;
        }


        if (playerNumber !== this.turn) {
            return;
        }

        if (this.players[playerNumber].coins[coinNumber].position === -1) {
            if (steps !== 6) {
                return;
            } else {
                this.open(playerNumber, coinNumber);
            }
        }


        var positionAfterWalk = this.players[playerNumber].walkPlayer(coinNumber, steps);
        console.log("Position after walk : " + positionAfterWalk);

        var isAnyCoinGotCut = this.cut(playerNumber, positionAfterWalk);
        if (isAnyCoinGotCut) {
            this.players[this.turn].extraTurns++;
            this.rollTurn = this.turn;
        }

        this.conditionalNextTurn();
        return this;
    }

    cut(playerNumber, positionToCheck) {

        var isAnyCoinGotCut = false;
        this.players.forEach(function (player, playerIndex) {
            if (playerIndex !== playerNumber) {
                player.coins.forEach(function (coin, coinIndex) {
                    var position = coin.position;
                    if (!coin.isSafe) {
                        if (position === positionToCheck) {
                            coin.gotCut();
                            isAnyCoinGotCut = true;
                        }
                    }
                });
            }
        });
        return isAnyCoinGotCut;
    }

    conditionalNextTurn() {
        var extraTurns = this.players[this.turn].extraTurns;
        var values = this.players[this.turn].diceValues;
        var diceValueSum = values.reduce(function (sum, value) {
            return sum + value;
        }, 0);
        if (extraTurns == 0 && diceValueSum == 0) {
            this.nextTurn();
        } else {
            console.log("Not going for next turn as extraTurns = " + extraTurns + " and values = " + values)
        }
    }

    nextTurn() {
        this.players[this.turn].clearValues();
        if (this.turn === 3) {
            this.turn = 0;
        } else {
            this.turn += 1;
        }

        console.log("turn set to " + this.turn);

    }

    nextRollTurn() {
        console.log("extra turns" + this.players[this.turn].extraTurns);
        if (this.players[this.turn].extraTurns > 1) {
            this.players[this.turn].extraTurns--;
            return;
        }
        this.players[this.turn].extraTurns = 0;
        if (this.rollTurn === 3) {
            this.rollTurn = 0;
        } else {
            this.rollTurn += 1;
        }
        console.log("rollTurn set to " + this.rollTurn);
    }


    rollDice() {
        if (this.players[this.turn].extraTurns > 0) {
            this.players[this.turn].extraTurns--;
        }
        var diceValue = Math.floor(Math.random() * (6)) + 1;
        this.lastDiceValue = diceValue;
        this.afterRollChecks();
    }

    afterRollChecks() {

        var diceValue = this.lastDiceValue;
        this.players[this.turn].pushValue(diceValue);

        // check to see if player got three 6's
        var values = this.players[this.turn].diceValues;
        var diceValueSum = values.reduce(function (sum, value) {
            return sum + value;
        }, 0);


        if (diceValueSum === 18) {
            this.nextRollTurn();
            this.nextTurn();
            return;
        }


        if (!(this.canAnyCoinWalk())) {
            console.log("None can walk");
            this.players[this.turn].clearValues();
            this.nextRollTurn();
            this.nextTurn();
            return;
        }

        if (diceValue != 6) {
            this.nextRollTurn();
            return;
        } else {
            console.log("It is 6");
            this.players[this.turn].extraTurns++;
        }
        return;
    }

    /**
     * This method checks whether any coin of the player will be able to walk/open
     * using the remaining values in player dice values.
     * If not we will clear the player's remaining values and move on to the next turn or roll turn.
     */
    canAnyCoinWalk() {
        var player = this.players[this.turn];
        for (var diceValueIndex = 0; diceValueIndex < player.diceValues.length; diceValueIndex++) {
            var diceValue = player.diceValues[diceValueIndex];
            for (var coinIndex = 0; coinIndex < 4; coinIndex++) {
                var coin = player.coins[coinIndex];
                if (coin.canWalk(diceValue)) {
                    return true;
                }
            }
        }
        return false; // No coin can walk remaining values.
    }


}

if (module) {
    module.exports = Game;
}