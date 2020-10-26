
// Don't use. Just here in case it has valuable code samples

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost/pvpoke/src/battle/');

    await page.select("select.mode-select", "matrix");

    page.waitForNavigation({ waitUntil: 'load' });
    const metaName = process.argv[2];
    await page.select("select.quick-fill-select", metaName);

    // for whatever reason, this works to wait for a page load,
    // but nothing else will...
    await page.screenshot({ path: 'test.png' });


    const out = await page.evaluateHandle(() => {
        var rankingsContainer = document.querySelector('.rankings-container');

        let parsedRankings = [];
        rankingsContainer.childNodes.forEach((ranking) => {
            let parsedRanking = new Object();
            parsedRanking.name = ranking.querySelector(".name").textContent;
            var movesString = ranking.querySelector(".moves").textContent;
            movesString = movesString.replace("*", ""); // remove legacy marker
            parsedRanking.movesString = movesString;
            parsedRankings.push(parsedRanking);
        });

        return JSON.stringify(parsedRankings);
    });


    //await console.log(out._remoteObject.value);
    fs.writeFile('./temp/meta.txt', out._remoteObject.value, (err) => {
        if (err) throw err;
    });

    await browser.close();
})();

