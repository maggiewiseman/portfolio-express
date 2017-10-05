const fs  = require('fs');

function getDirList() {
    var dirs = fs.readdirSync(`${__dirname}/projects`);
    //returns an array of directory names
    return dirs;
}

module.exports.getDirList = getDirList;
