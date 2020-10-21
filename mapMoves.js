
const fs = require('fs');
var gamemasterJson; // probably less overhead by NOT passing around this massive thing

fs.readFile('./temp/meta.txt', 'utf8', function (err, data) {
    var meta = JSON.parse(data);

    fs.readFile('C:/xampp/htdocs/pvpoke/src/data/gamemaster.json', 'utf8', function (err, data) {
        gamemasterJson = JSON.parse(data);
        //console.log(gamemasterJson.pokemon[1]);
        //console.log(meta);
        mapPokemonMovesToNumbers(meta[0]);
    })

})

function mapPokemonMovesToNumbers(thePokemonEntry) {
    var gamemasterPokemon = findGamemasterPokemon(thePokemonEntry.name);
    console.log(gamemasterPokemon);
    var movesArray = thePokemonEntry.movesString.split(',');
    var movesNumberString = "";

    for (var move of movesArray) {
        var moveId = findGamemasterMove(move.trim());
        console.log(moveId);
    }
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