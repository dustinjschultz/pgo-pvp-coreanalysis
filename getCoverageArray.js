
const puppeteer = require('puppeteer');
const fs = require('fs');

var browser;
var page;

function getCoverageGradeFromPage() {
    return document.getElementsByClassName('coverage')[0].getElementsByClassName('grade')[0].textContent;
}

(async () => {
    //browser = await puppeteer.launch();
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();

    var meta;
    fs.readFile('./temp/metaWithNumbers.txt', 'utf8', function (err, data) {
        meta = JSON.parse(data);

        (async () => {
            var myCoverageArray = await createCoverageArray(meta);
            //fs.writeFile('./temp/metaCoverageArray.txt', JSON.stringify(myCoverageArray), (err) => {
            //    if (err) throw err;
            //});
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
    var myTotalArraySlotsToFill = combinations(myMetaSize, 2);
    var mySlotsFilledCounter = 0; // could be calculated as I go, but this is easier
    var myStartingOuter = 0;
    var myStartingInner = 1;
    var myIsResumeFlag = process.argv[3] == "resume"; // ex call: `node getCoverageArray venture resume`

    // changes for 023_add_resume_logic: (I think, only thought about this, haven't tried)
    // add a part at the startup here that's an if(isResume) // based on the command line args 
    // https://stackoverflow.com/questions/4351521/how-do-i-pass-command-line-arguments-to-a-node-js-program
    // based on that if, set startingOuter and startingInner and mySlotsFilledCounter to 0, 0, 1 respectively
    // or else do a calc for them
    // to calc startingOuter, need a method: isRowComplete(the1dArray) : boolean
    // call this method on rows 0-n until a row returns true
    // to calc startingInner, determine startingOuter, then for the incomplete row, need a method:
    // getRowCompletion(the1dArray) : int
    // where int is the index of the last filled position
    // now that the starting positions are esttablished, change the loop variables to start at startingOuter and startingInner
    if (myIsResumeFlag) {
        myCoverageArray = getMetaCoverageArrayFromFile();

        for (var i = 0; i < myMetaSize; i++) {
            if (!isRowComplete(myCoverageArray[i])) {
                myStartingOuter = i;
                break;
            }
        }
        myStartingInner = getNextRowSlotToFill(myCoverageArray[i], i);

        // count occurrences of [A-F]
        mySlotsFilledCounter = (myCoverageArray.toString().match(/[A-F]/g) || []).length;
    }

    for (var i = myStartingOuter; i < myMetaSize; i++) {
        myCoverageArray[i][i] = "X";

        if (!myIsResumeFlag) {
            myStartingInner = i + 1;
        }

        for (var j = myStartingInner; j < myMetaSize; j++) {
            myCoverageArray[i][j] = await getCoverageForMetaPair(theMeta[i], theMeta[j]);
            mySlotsFilledCounter++;
            console.log(theMeta[i].speciesId + " x " + theMeta[j].speciesId + ": " + myCoverageArray[i][j]
                + " progress: " + mySlotsFilledCounter + "/" + myTotalArraySlotsToFill);

            fs.writeFile('./temp/metaCoverageArray.txt', JSON.stringify(myCoverageArray), (err) => {
                if (err) throw err;
            });

            // it's only a "resume" the first iteration, so stop using resume logic after an interation
            myIsResumeFlag = false;
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

function product_Range(a, b) {
    // https://www.w3resource.com/javascript-exercises/javascript-math-exercise-42.php
    var prd = a, i = a;

    while (i++ < b) {
        prd *= i;
    }
    return prd;
}


function combinations(n, r) {
    if (n == r) {
        return 1;
    }
    else {
        r = (r < n - r) ? n - r : r;
        return product_Range(r + 1, n) / product_Range(1, n - r);
    }
}

function isRowComplete(the1dArray, theExpectedLength) {
    return the1dArray.length == theExpectedLength;
}

/**
 * 
 * @param {any} the1dArray
 * @param {any} theRowNumber 0-indexed
 */
function getNextRowSlotToFill(the1dArray, theRowNumber) {
    // this isn't quite as straight forward as getting the length
    // a row's first entry (the "X") fills the nulls to the left
    // so in the case where a row hasn't been started, its length is 0
    // but we don't start filling at 0 ever, we start at theRowNumber+1
    // example: [[X, A, B], [null, X, A], []]
    myNextSlot = -1;
    if (the1dArray.length == 0) {
        // since the first rowNumber slots are just null or 'X', we don't care
        myNextSlot = theRowNumber + 1;
    } else {
        myNextSlot = the1dArray.length;
    }
    return myNextSlot;
}

function getMetaCoverageArrayFromFile() {
    var myFileContents = fs.readFileSync('./temp/metaCoverageArray.txt', { encoding: 'utf8', flag: 'r' }) 
    return JSON.parse(myFileContents);
}