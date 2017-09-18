//Class coin
class Coin {

    constructor(startPosition, endPosition) {
        this.startPosition = Number(startPosition);
        this.endPosition = Number(endPosition);
        this.position = -1;
        this.isSafe = true;
        this.isOpened = false;
        this.isCompleted = false;
        this.isInFinalrow = false;
    }

    gotCut() {
        this.position = -1;
        this.isSafe = true;

    }

    open() {
        this.position = this.startPosition;
        this.isOpened = true;
        this.isSafe = true;
    }

    shouldMoveIntoSuccessRow(afterWalkPosition) {
        if (this.position > this.endPosition) {
            return false;
        } else if (afterWalkPosition <= this.endPosition) {
            return false;
        }
        return true;

    }


    /**
     * This function will walk the coin given number of steps
     * @param steps
     * @returns {*}
     */
    walkCoin(steps) {
        steps = Number(steps);


        console.log('Coin current position: ' + this.position);
        console.log("walking coin these many steps: " + steps);
        var afterWalkPosition = this.position + steps;
        //check whether coin is in final row.


        if (this.isInFinalrow) {
            return this.walkForSuccess(steps);
        }

        if (this.shouldMoveIntoSuccessRow(afterWalkPosition)) { // Move coin to success row
            var stepsToEnterSuccessRow = this.endPosition - this.position + 1;
            var remainingSteps = steps - stepsToEnterSuccessRow;
            console.log('Coin will enter success column with remaining steps :' + remainingSteps);
            this.position = this.endPosition * 10;
            this.isInFinalrow = true;
            this.isSafe = true;
            return this.walkForSuccess(remainingSteps);
        }


        if (afterWalkPosition > 52) {
            console.log(" Recycling the positions");
            var rem = afterWalkPosition - 52;
            this.position = rem;
        } else {
            console.log("Normal Walk")
            this.position += steps;
            this.checkSafety();
        }
        return this.position;


    }

    checkSafety() {
        var safePositions = [1, 9, 14, 22, 27, 35, 40, 48];
        var coin = this;
        safePositions.forEach(function (safePosition) {
            if (coin.position === safePosition) {
                coin.isSafe = true;
                // return true;
            }
        });
        this.isSafe = false;
    }

    walkForSuccess(steps) {
        console.log("walk for success " + steps);
        var finalPosition = this.endPosition * 10 + 4;
        var requiredStepsForSuccess = finalPosition - this.position + 1;
        if (steps < requiredStepsForSuccess) {
            this.position += steps;

        }
        if (steps === requiredStepsForSuccess) {
            this.position = 1000;
            this.isCompleted = true;
        }
        console.log("Cannot move coin as only " + requiredStepsForSuccess + " are required for success.");
        return this.position;
    }

    canWalk(steps) {
        if (this.isCompleted) {
            console.log("this is completed");
            return false;
        }

        steps = Number(steps);

        if (!this.isOpened && steps != 6) {
            console.log("Coin is not opened, hence cannot walk.");
            return false;
        }

        if (this.isInFinalrow) {
            var finalPosition = this.endPosition * 10 + 4;
            var requiredStepsForSuccess = finalPosition - this.position + 1;
            if (steps > requiredStepsForSuccess) {
                console.log("More than the required steps for the coin, cannot walk.")
                return false;
            }
        }
        console.log("returning true.")
        return true;
    }


}

module.exports = Coin;

