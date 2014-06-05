var fs = require('fs');
var nodePath = require('path');
var dust = require('dustjs-linkedin');
var nameRegExp = /%TEMPLATE%/g;

module.exports = function(config) {

    return function onLoad(path, callback) {

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
                    // We need to compile the file
                    fs.readFile(path, 'utf8', function(err, src) {
                        if (err) {
                            return callback(err);
                        }

                        var compiled = dust.compile(src, path);
                        dust.loadSource(compiled);

                        var nameStrStart = compiled.indexOf(path);
                        compiled = compiled.substring(0, nameStrStart) + '%TEMPLATE%' + compiled.substring(nameStrStart + path.length);

                        fs.writeFile(compiledOutputFilename, compiled, 'utf8', function(err) {
                            if (err) {
                                return callback(err);
                            }

                            callback();
                        });
                    });
                } else {
                    fs.readFile(compiledOutputFilename, 'utf8', function(err, compiled) {
                        if (err) {
                            return callback(err);
                        }
                        compiled = compiled.replace(nameRegExp, path);

                        dust.loadSource(compiled);
                        callback();
                    });
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