const fs = require('fs');
const path = require('path');

fs.rmdirSync(path.resolve(__dirname, '../dist'), {recursive: true});

