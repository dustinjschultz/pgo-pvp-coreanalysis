
const fs = require('fs');


var metaCoverageArray;
var meta;


fs.readFile('./temp/metaCoverageArray.txt', 'utf8', function (err, data) {
    metaCoverageArray = JSON.parse(data);
    fs.readFile('./temp/metaWithNumbers.txt', 'utf8', function (err, data) {
        meta = JSON.parse(data);

        var nodes = createNodes(meta);
        var edges = createEdges(metaCoverageArray);

        var graphData = nodes.concat(edges);

        fs.writeFile('./temp/graphData.txt', JSON.stringify(graphData), (err) => {
        });

    })
})

// nodes
//{ data: { id: 'a' } },
//{ data: { id: 'b' } },
//{ data: { id: 'c' } },
//{ data: { id: 'd' } },
//{ data: { id: 'e' } },

function createNodes(theMeta) {
    var myNodes = [];

    var myMetaSize = theMeta.length;
    for (var i = 0; i < myMetaSize; i++) {
        var myNode = new Object();
        myNode.id = i;
        myNode.label = theMeta[i].speciesId;

        var myData = new Object();
        myData.data = myNode;
        myNodes.push(myData);
    }

    return myNodes;
}


//// edges
//{
//    data: {
//        id: 'ab',
//            source: 'a',
//                target: 'b'
//    }
//},
//{
//    data: {
//        id: 'cd',
//            source: 'c',
//                target: 'd'
//    }
//},

function createEdges(theMetaCoverageArray) {
    var myEdges = [];

    var myMetaSize = theMetaCoverageArray[0].length;
    for (var i = 0; i < myMetaSize; i++) {
        for (var j = i + 1; j < myMetaSize; j++) {
            var myCurrentGrade = theMetaCoverageArray[i][j];
            //console.log(myCurrentGrade);
            if (myCurrentGrade == "A" || myCurrentGrade == "B") {
                var myEdge = new Object();
                myEdge.source = i;
                myEdge.target = j;
                myEdge.id = i + "-" + j;

                var myData = new Object();
                myData.data = myEdge;
                myEdges.push(myData);
            }
        }
    }

    return myEdges;
}
