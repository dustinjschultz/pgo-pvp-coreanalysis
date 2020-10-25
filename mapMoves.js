// Don't use. Just here in case it has valuable code samples

const puppeteer = require('puppeteer');
const fs = require('fs');

var browser;
var page;

function getMoveNumbersFromPage(thePokemonEntry) {
    var myMoveSelectors = document.querySelectorAll(`div.modal-content > div.poke .move-select-container > .move-select`);
    var myReturn = "";
    myReturn += getMoveFromSelectNode(myMoveSelectors[0], thePokemonEntry.fastMove);
    myReturn += "-";
    myReturn += getMoveFromSelectNode(moMoveSelectors[1], thePokemonEntry.chargedMoves[0]);
    myReturn += "-";
    myReturn += getMoveFromSelectNode(moMoveSelectors[1], thePokemonEntry.chargedMoves[1]);
    return myReturn;
}

function getMoveFromSelectNode(theSelectNode, theChargeMoveId) {
    var myChild = theSelectNode.querySelector(`option[value="${theChargeMoveId}"`);
    return Array.prototype.indexOf.call(myChild.parent.children, myChild);
}

fs.readFile('./temp/meta.txt', 'utf8', function (err, data) {
    (async () => {
        //browser = await puppeteer.launch();
        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();

        var meta = JSON.parse(data);
        await setUpPage();

        await getMonsMoveNumbersString(meta);
        console.log(meta);

        fs.writeFile('./temp/metaWithNumbers.txt', JSON.stringify(meta), (err) => {
            if (err) throw err;
        });

        await browser.close();
    })();
})


async function getMonsMoveNumbersString(thePokemonList) {
    for (var currentPokemon of thePokemonList) {
        await getMonMoveNumbersString(currentPokemon);
    }
}

async function setUpPage() {
    await page.goto("http://localhost/pvpoke/src/team-builder");
    page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.addScriptTag({ content: `${getMoveNumbersFromPage}` });
    await page.addScriptTag({ content: `${getMoveFromSelectNode}` });

    var metaName = process.argv[2];
    await page.evaluate(optionSelector => {
        return document.querySelector(optionSelector).setAttribute('selected', 'true');
    }, `select.format-select > option[cup="${metaName}"]`);

    await page.$eval(`button.add-poke-btn`, el => el.click());
}

async function getMonMoveNumbersString(thePokemonEntry) {
    await page.evaluate(optionSelector => {
        return document.querySelector(optionSelector).setAttribute('selected', 'true');
    }, `div.modal-content > div.poke > select.poke-select > option[value="${thePokemonEntry.speciesId}"]`);

    var myMoveNumbersString = await getMoveNumbers(thePokemonEntry);
    thePokemonEntry.moveNumbersString = myMoveNumbersString;

}

function getMoveNumbers(thePokemonEntry) {

}
