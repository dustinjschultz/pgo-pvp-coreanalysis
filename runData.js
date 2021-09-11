
// TODO: define a graphData which is an array of Nodes and array of Edges
// TODO: define Node
// TODO: define Edge
// TODO: figure out how to do the above since they're anonymous types


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
}