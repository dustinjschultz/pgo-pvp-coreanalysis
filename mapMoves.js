
const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config()

var browser;
var page;

function getMoveNumbersFromPage(thePokemonEntry) {
    var myMoveSelectors = document.querySelectorAll(`div.modal-content > div.poke .move-select-container > .move-select`);
    var myReturn = "";
    myReturn += getMoveFromSelectNode(myMoveSelectors[0], thePokemonEntry.fastMove);
    myReturn += "-";
    myReturn += getMoveFromSelectNode(myMoveSelectors[1], thePokemonEntry.chargedMoves[0]);
    myReturn += "-";
    myReturn += getMoveFromSelectNode(myMoveSelectors[1], thePokemonEntry.chargedMoves[1]);
    return myReturn;
}

function getMoveFromSelectNode(theSelectNode, theChargeMoveId) {
    var myChild = theSelectNode.querySelector(`option[value="${theChargeMoveId}"`);
    return Array.prototype.indexOf.call(myChild.parentElement.children, myChild);
}

fs.readFile('./temp/meta.txt', 'utf8', function (err, data) {
    (async () => {
        //browser = await puppeteer.launch();
        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();

        var meta = JSON.parse(data);
        await setUpPage();

        await getMonsMoveNumbersString(meta);

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
	await Promise.all([
		page.goto(`${process.env.PVPOKE_LOCALHOST_URL}team-builder`),
		page.waitForNavigation({ waitUntil: 'networkidle2' }),
	]);
    await page.addScriptTag({ content: `${getMoveNumbersFromPage}` });
    await page.addScriptTag({ content: `${getMoveFromSelectNode}` });

    var metaName = process.env.RUN_META_NAME;
    await page.evaluate(optionSelector => {
        return document.querySelector(optionSelector).setAttribute('selected', 'true');
    }, `select.format-select > option[cup="${metaName}"]`);

    await page.$eval(`button.add-poke-btn`, el => el.click());
}

async function getMonMoveNumbersString(thePokemonEntry) {
    var myMoveNumbersString = await page.evaluate((optionSelector, thePokemonEntry) => {
        document.querySelector(optionSelector).setAttribute('selected', 'true');
        document.querySelector(optionSelector).dispatchEvent(new Event('change', { 'bubbles': true }))
        return getMoveNumbersFromPage(thePokemonEntry);
    }, `div.modal-content > div.poke > select.poke-select > option[value="${thePokemonEntry.speciesId}"]`, thePokemonEntry);

    thePokemonEntry.moveNumbersString = myMoveNumbersString;

}

