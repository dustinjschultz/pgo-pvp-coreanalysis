
const puppeteer = require('puppeteer');
const fs = require('fs');

var browser;
var page;

function getCoverageGradeFromPage() {
    return document.getElementsByClassName('coverage')[0].getElementsByClassName('grade')[0].textContent;
}

(async () => {
    browser = await puppeteer.launch();
    //browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();

    var meta;
    fs.readFile('./temp/metaWithNumbers.txt', 'utf8', function (err, data) {
        meta = JSON.parse(data);

        (async () => {
            var myCoverageArray = await createCoverageArray(meta);
            fs.writeFile('./temp/metaCoverageArray.txt', myCoverageArray, (err) => {
                if (err) throw err;
            });
            await browser.close();
        })();
    })
})();

function generateUrl(theMon1, theMon2) {
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

async function createCoverageArray(theMeta) {
    var myMetaSize = theMeta.length;
    var myCoverageArray = create2dArray(myMetaSize);

    for (var i = 0; i < myMetaSize; i++) {
        for (var j = i + 1; j < myMetaSize; j++) {
            myCoverageArray[i][j] = await getCoverageForMetaPair(theMeta[i], theMeta[j]);
            console.log(theMeta[i].name + " x " + theMeta[j].name + ": " + myCoverageArray[i][j]);
        }
    }

    return myCoverageArray;
}

function create2dArray(theRows) {
    var myArray = [];

    for (var i = 0; i < theRows; i++) {
        myArray[i] = [];
    }

    return myArray;
}

async function getCoverageForMetaPair(theMon1, theMon2) {
    var url = generateUrl(theMon1, theMon2);
    await page.goto(url);
    await page.waitForNavigation({ waitUntil: 'networkidle2' }) 

    // addScriptTag so it can be used on the page
    await page.addScriptTag({ content: `${getCoverageGradeFromPage}` });

    const out = await page.evaluateHandle(() => {
        var grade = getCoverageGradeFromPage();
        return grade;
    });

    return out._remoteObject.value;
}

