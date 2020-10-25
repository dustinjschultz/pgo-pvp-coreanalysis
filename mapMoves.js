// Don't use. Just here in case it has valuable code samples

const puppeteer = require('puppeteer');
const fs = require('fs');

var browser;
var page;

fs.readFile('./temp/meta.txt', 'utf8', function (err, data) {
    (async () => {
        //browser = await puppeteer.launch();
        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();

        var meta = JSON.parse(data);
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

async function getMonMoveNumbersString(thePokemonEntry) {
    var metaName = process.argv[2];

    await page.goto("http://localhost/pvpoke/src/team-builder");
    page.waitForNavigation({ waitUntil: 'networkidle2' }) 

    await page.evaluate(optionSelector => {
        return document.querySelector(optionSelector).setAttribute('selected', 'true');
    }, `select.format-select > option[cup="${metaName}"]`);
    console.log('blah');

    //await page.waitForNavigation({ waitUntil: 'networkidle2' });

    //await page.$eval(`button.add-poke-btn`, el => el.click());
    //await page.waitForNavigation({ waitUntil: 'networkidle2' });

    //await page.select("select.poke-select", thePokemonEntry.speciesId);
    //await page.waitForNavigation({ waitUntil: 'networkidle2' });

}

function getFastMoveNumberFromPage(theFastMoveId) {

}

function getChargeMoveNumberFromPage(theChargeMoveId) {

}

