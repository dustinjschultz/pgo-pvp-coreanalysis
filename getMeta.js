
const fs = require('fs');
require('dotenv').config()
const metaName = process.env.RUN_META_NAME;

fs.readFile(`${process.env.PVPOKE_SRC_LOCATION}data/groups/${metaName}.json`, 'utf8', function (err, data) {
    fs.writeFile('./temp/meta.txt', data, (err) => {
        if (err) throw err;
    });
})
