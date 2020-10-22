
const puppeteer = require('puppeteer');
const fs = require('fs');

function getCoverageGrade() {
    return document.getElementsByClassName('coverage')[0].getElementsByClassName('grade')[0].textContent;
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();


    var meta;
    fs.readFile('./temp/metaWithNumbers.txt', 'utf8', function (err, data) {
        meta = JSON.parse(data);
        (async () => {
            var url = generateUrl(meta[0], meta[1]);
            await page.goto(url);
            //await page.screenshot({ path: 'test.png' });
            page.waitForNavigation({ waitUntil: 'networkidle2' }) // works but makes bad output

            // addScriptTag so it can be used on the page
            await page.addScriptTag({ content: `${getCoverageGrade}` });

            const out = await page.evaluateHandle(() => {
                var grade = getCoverageGrade();
                //var grade = document.getElementsByClassName('coverage')[0].getElementsByClassName('grade')[0].textContent;
                return grade;
            });

            console.log(out._remoteObject.value);
            await browser.close();
        })();
    })
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

