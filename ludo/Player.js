var Coin = require('./Coin')

class Player {

    constructor(startPosition, endPosition) {
        this.coins = [new Coin(startPosition, endPosition), new Coin(startPosition, endPosition), new Coin(startPosition, endPosition), new Coin(startPosition, endPosition)];
        this.turn = false;
        this.extraTurns = 0;
        this.diceValues = [];
    }

    open(coinNumber) {
        this.coins[coinNumber].open();
        this.removeValueUsingValue(6);
    }

    walkPlayer(coinNumber, steps) {
        var currentPosition = this.coins[coinNumber].position;
        var positionAfterWalk = this.coins[coinNumber].walkCoin(steps);
        if (Number(currentPosition) !== Number(positionAfterWalk)) {
            this.removeValueUsingValue(steps);
        }
    }

    removeValueUsingValue(value) {
        var steps = Number(value);
        var valueIndex = this.diceValues.indexOf(steps);
        console.log("Index to clear : " + valueIndex);
        if (valueIndex > -1) {
            this.diceValues.splice(valueIndex, 1);
        }
        console.log("dice Values " + this.diceValues);

    }

    pushValue(value) {
        var val = Number(value);
        console.log("pushing value" + val);
        this.diceValues.push(val);
        console.log("dice Values " + this.diceValues);
    }

    removeValue(position) {
        console.log("removing value" + this.diceValues[position]);
        this.diceValues.splice(position, 1);
        console.log("dice Values " + this.diceValues);
    }

    clearValues() {
        this.diceValues.length = 0;
    }
}

if (module) {
    module.exports = Player;
}