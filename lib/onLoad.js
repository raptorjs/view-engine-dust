require('raptor-polyfill/string/endsWith');

var fs = require('fs');
var nodePath = require('path');

var compiler = require('dustc-commonjs');

module.exports = function(config) {

    return function onLoad(input, callback) {

        var path = input;

        var dust = config.dust;

        if (!path.endsWith('.dust')) {
            path = path + '.dust';
        }

        path = nodePath.resolve(process.cwd(), path);

        var compiledOutputFilename = path + '.js';

        // See if the template has already been compiled and if it is up-to-date...

        var inFileLastModified;
        var outFileLastModified;

        function compareTimes() {
            if (outFileLastModified && inFileLastModified) {
                if (inFileLastModified === -1) {
                    callback(new Error('Template not found at path "' + path + '"'));
                } else if (outFileLastModified === -1 || inFileLastModified > outFileLastModified) {
                    // The compiled template has not been saved to disk

                    // We need to compile the file
                    compiler.compileFile(path, { dust: dust }, function(err, compiled) {
                        if (err) {
                            return callback(err);
                        }

                        fs.writeFile(compiledOutputFilename, compiled, 'utf8', function(err) {
                            if (err) {
                                return callback(err);
                            }

                            dust.cache[input] = require(compiledOutputFilename);
                            callback();
                        });
                    });
                } else {
                    dust.cache[input] = require(compiledOutputFilename);
                    callback();
                }
            }
        }

        fs.stat(path, function(err, stat) {
            inFileLastModified = err ? -1 : stat.mtime.getTime();
            compareTimes();
        });

        fs.stat(compiledOutputFilename, function(err, stat) {
            outFileLastModified = err ? -1 : stat.mtime.getTime();
            compareTimes();
        });
    };
};