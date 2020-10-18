
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost/pvpoke/src/battle/');


    var metaName = process.argv[2];
    document.querySelector(".poke.multi").querySelector(".quick-fill-select").querySelector("option[value=" + metaName + "]").click();

    var rankingsContainer = document.querySelector('.rankings-container');
    console.log(JSON.stringify(rankingsContainer));

    await browser.close();
})();