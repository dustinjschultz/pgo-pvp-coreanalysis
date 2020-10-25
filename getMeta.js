
const fs = require('fs');
const metaName = process.argv[2];

fs.readFile(`C:/xampp/htdocs/pvpoke/src/data/groups/${metaName}.json`, 'utf8', function (err, data) {
    fs.writeFile('./temp/meta.txt', data, (err) => {
        if (err) throw err;
    });
})
