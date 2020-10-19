
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost/pvpoke/src/battle/');

    await page.select("select.mode-select", "matrix");

    page.waitForNavigation({ waitUntil: 'load' });
    const metaName = process.argv[2];
    await page.select("select.quick-fill-select", metaName);

    const out = await page.evaluateHandle(() => {
        var rankingsContainer = document.querySelector('.rankings-container');

        let parsedRankings = [];
        rankingsContainer.childNodes.forEach((ranking) => {
            let parsedRanking = new Object();
            parsedRanking.name = ranking.querySelector(".name").textContent;
            parsedRanking.movesString = ranking.querySelector(".moves").textContent;
            parsedRankings.push(parsedRanking);
        });

        return JSON.stringify(parsedRankings);
    });

    await console.log(out);

    await browser.close();
})();

