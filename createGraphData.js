
const fs = require('fs');


var metaCoverageArray;
var meta;


fs.readFile('./temp/metaCoverageArray.txt', 'utf8', function (err, data) {
    metaCoverageArray = JSON.parse(data);
    fs.readFile('./temp/metaWithNumbers.txt', 'utf8', function (err, data) {
        meta = JSON.parse(data);

        var nodes = createNodes(meta);
        var edges = createEdges(metaCoverageArray);

        fs.writeFile('./temp/nodes.txt', JSON.stringify(nodes), (err) => {
            fs.writeFile('./temp/edges.txt', JSON.stringify(edges), (err) => {

            });
        });

    })
})

//var nodes = new vis.DataSet([
//    { id: 1, label: "Node 1" },
//    { id: 2, label: "Node 2" },
//    { id: 3, label: "Node 3" },
//    { id: 4, label: "Node 4" },
//    { id: 5, label: "Node 5" },
//]);

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

//var edges = new vis.DataSet([
//    { from: 1, to: 3 },
//    { from: 1, to: 2 },
//    { from: 2, to: 4 },
//    { from: 2, to: 5 },
//    { from: 2, to: 3 },
//    { from: 3, to: 3 },
//]);

function createEdges(theMetaCoverageArray) {
    var myEdges = [];

    var myMetaSize = theMetaCoverageArray[0].length;
    for (var i = 0; i < myMetaSize; i++) {
        for (var j = i + 1; j < myMetaSize; j++) {
            var myCurrentGrade = theMetaCoverageArray[i][j];
            //console.log(myCurrentGrade);
            if (myCurrentGrade == "A" || myCurrentGrade == "B") {
                var myEdge = new Object();
                myEdge.from = i;
                myEdge.to = j;
                myEdges.push(myEdge);
            }
        }
    }

    return myEdges;
}
