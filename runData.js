
class MonData {
    speciesId = "";
    fastMove = "";
    chargedMoves = []; // String array
    moveNumbersString = "";

    constructor(speciesId, fastMove, chargedMoves, moveNumbersString) {
        this.speciesId = speciesId;
        this.fastMove = fastMove;
        this.chargedMoves = chargedMoves;
        this.moveNumbersString = moveNumbersString;
    }

    static fromAnonObject(anonObject) {
        var myReturn = new MonData(
            anonObject.speciesId,
            anonObject.fastMove,
            anonObject.chargedMoves,
            anonObject.moveNumbersString
        );

        return myReturn;
    }
}

class RunData {
    mons = []; // array of MonData
    metaCoverageArray = [[]]; // String array array

    constructor(mons) {
        this.mons = mons;
    }

    getMonNames() {
        var myReturn = [];
        for (var mon of this.mons) {
            myReturn.push(mon.speciesId);
        }
        return myReturn;
    }

    getJson() {
        return JSON.stringify(this);
    }

    static fromAnonObject(anonObject) {
        var myReturn = new RunData([]);

        for (var anonMon of anonObject.mons) {
            var myMonData = MonData.fromAnonObject(anonMon);
            myReturn.mons.push(myMonData);
        }

        myReturn.metaCoverageArray = anonObject.metaCoverageArray;
        return myReturn;
        // potential enhancement: using Object.keys(myAnonObject) to make it dynamic
        // need to figure out how to deal with objects with nested keys though
    }
}

// TODO: next steps: actually use this Class