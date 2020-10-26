
const fs = require('fs');

//// create an array with nodes
//var nodes = new vis.DataSet([
//    { id: 1, label: "Node 1" },
//    { id: 2, label: "Node 2" },
//    { id: 3, label: "Node 3" },
//    { id: 4, label: "Node 4" },
//    { id: 5, label: "Node 5" },
//]);

//var edges = new vis.DataSet([
//    { from: 1, to: 3 },
//    { from: 1, to: 2 },
//    { from: 2, to: 4 },
//    { from: 2, to: 5 },
//    { from: 2, to: 3 },
//    { from: 3, to: 3 },
//]);

var metaCoverageArray;
var meta;


fs.readFile('./temp/metaCoverageArray.txt', 'utf8', function (err, data) {
    metaCoverageArray = data;
    fs.readFile('./temp/metaWithNumbers.txt', 'utf8', function (err, data) {
        meta = JSON.parse(data);

        var nodes = createNodes(meta);
        console.log(nodes);

    })
})

function createNodes(theMeta) {
    var myNodes = [];

    var myMetaSize = theMeta.length;
    for (var i = 0; i < myMetaSize; i++) {
        var myNode = new Object();
        myNode.id = i;
        myNode.label = theMeta[i].speciesId;
        myNodes.push(myNode);
    }

    return myNodes;
}

