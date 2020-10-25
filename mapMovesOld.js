
// Don't use. Just here in case it has valuable code samples

const fs = require('fs');
var gamemasterJson; // probably less overhead by NOT passing around this massive thing

fs.readFile('./temp/meta.txt', 'utf8', function (err, data) {
    var meta = JSON.parse(data);

    fs.readFile('C:/xampp/htdocs/pvpoke/src/data/gamemaster.json', 'utf8', function (err, data) {
        gamemasterJson = JSON.parse(data);
        mapMonsDisplayDataToIdData(meta);

        fs.writeFile('./temp/metaWithNumbers.txt', JSON.stringify(meta), (err) => {
            if (err) throw err;
        });
    })

})

function mapMonsDisplayDataToIdData(thePokemonList) {
    for (var currentPokemon of thePokemonList) {
        mapMonDisplayDataToIdData(currentPokemon);
    }
}

function mapMonDisplayDataToIdData(thePokemonEntry) {
    var gamemasterPokemon = findGamemasterPokemon(thePokemonEntry.name);
    var movesArray = thePokemonEntry.movesString.split(',');
    var moveNumbersString = "";

    var fastMove = movesArray[0];
    var moveId = findGamemasterMove(fastMove.trim());
    var moveNumber = getFastMoveNumberForPokemon(moveId, gamemasterPokemon);
    moveNumbersString += moveNumber + "-";

    // TODO: going wrong here:
    // need to add 1 for the "none" option
    // also need to figure out how to account for Return move...
    var chargeMove1 = movesArray[1];
    moveId = findGamemasterMove(chargeMove1.trim());
    moveNumber = getChargeMoveNumberForPokemon(moveId, gamemasterPokemon);
    moveNumbersString += moveNumber + "-";

    var chargeMove2 = movesArray[2];
    moveId = findGamemasterMove(chargeMove2.trim());
    moveNumber = getChargeMoveNumberForPokemon(moveId, gamemasterPokemon);
    moveNumbersString += moveNumber;

    thePokemonEntry.moveNumbersString = moveNumbersString;
    thePokemonEntry.speciesId = gamemasterPokemon.speciesId;
}

function findGamemasterPokemon(theName) {
    for (var gmPokemon of gamemasterJson.pokemon) {
        if (gmPokemon.speciesName == theName) {
            return gmPokemon;
        }
    }
}

function findGamemasterMove(theName) {
    for (var gmMove of gamemasterJson.moves) {
        if (gmMove.name == theName) {
            return gmMove.moveId;
        }
    }
}

function getFastMoveNumberForPokemon(theMoveId, theGmPokemon) {
    return getMoveNumberForPokemon(theMoveId, theGmPokemon, "fast");
}

function getChargeMoveNumberForPokemon(theMoveId, theGmPokemon) {
    return getMoveNumberForPokemon(theMoveId, theGmPokemon, "charged");
}

function getMoveNumberForPokemon(theMoveId, theGmPokemon, theMoveKind) {
    var attributeName = theMoveKind + "Moves";
    var movesArray = theGmPokemon[attributeName];
    for (var i = 0; i < movesArray.length; i++) {
        if (movesArray[i] == theMoveId) {
            return i;
        }
    }
}