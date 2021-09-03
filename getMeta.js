
const fs = require('fs');
const metaName = process.argv[2];
require('dotenv').config()

fs.readFile(`${process.env.PVPOKE_SRC_LOCATION}data/groups/${metaName}.json`, 'utf8', function (err, data) {
    fs.writeFile('./temp/meta.txt', data, (err) => {
        if (err) throw err;
    });
})
