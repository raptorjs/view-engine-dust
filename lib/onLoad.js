var fs = require('fs');
var nodePath = require('path');
module.exports = function(config) {
    var templatesDir = config.templatesDir || process.cwd();

    return function onLoad(path, callback) {
        if (!fs.existsSync(path)) {
            path = nodePath.join(templatesDir, path);
        }

        fs.readFile(path, 'utf8', callback);
    };
};