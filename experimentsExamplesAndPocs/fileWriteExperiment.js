
// Test script for seeing how long writing the array takes.
// Using this data to help determine what how much overhead constantly writing 
// the array adds rather than just once at the end.

// Conclusion: the size of the array doesn't really seem to matter.
// And file writes took ~23 ms the first time, but always under 10 after

// For the case of Venture (which was probably a larger meta), there were 861 pairs to check
// If it were to write after every single pair: 861 * 10 ms = 8.6 seconds 
// < 10 extra seconds is nothing considering how long the whole thing runs.
// I think I'll make it write after each pair.

const fs = require('fs');


(async () => {

    var my2dArray = fill2dArray(create2dArray(30));

    console.time("write")
    fs.writeFile('../temp/fileWriteExperiment.txt', JSON.stringify(my2dArray), (err) => {
        if (err) throw err;
        console.timeEnd("write")
    });


})();

function fill2dArray(the2dArray) {
    for (var i = 0; i < the2dArray.length; i++) {
        for (var j = 0; j < the2dArray[i].length; j++) {
            // random int 0 - 9
            the2dArray[i][j] = Math.floor(Math.random() * 10);
        }
    }
    return the2dArray;
}

function create2dArray(theRows) {
    var myArray = [];

    for (var i = 0; i < theRows; i++) {
        myArray[i] = [];
    }

    return myArray;
}