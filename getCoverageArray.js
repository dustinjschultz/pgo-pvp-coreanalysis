
const puppeteer = require('puppeteer');
const fs = require('fs');



(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();


    //await page.goto('http://localhost/pvpoke/src/battle/');

    fs.readFile('./temp/meta.txt', 'utf8', function (err, data) {
        var meta = JSON.parse(data);

        var url = generateUrl(meta[0], meta[1]);
        await page.goto(url);
        await page.screenshot({ path: 'test.png' });

    })

    await browser.close();
})();

function generateUrl(theMon1, theMon2){
    // ex: http://localhost/pvpoke/src/team-builder/sunrise/1500/abomasnow-m-0-5-2%2Caltaria-m-0-3-2
    var myReturn = "http://localhost/pvpoke/src/team-builder/"

    var metaName = process.argv[2];
    var mon1UrlStub = generateMonUrlStub(theMon1);
    var mon2UrlStub = generateMonUrlStub(theMon2);

    myReturn += metaName + "/1500/" + mon1UrlStub + "%2C" + mon2UrlStub;
    return myReturn;
}

function generateMonUrlStub(theMon) {
    return theMon.speciesId + "-m-" + theMon.moveNumbersString;
}