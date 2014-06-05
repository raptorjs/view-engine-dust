var dust = require('dustjs-linkedin');

module.exports = function(config) {
    return function onLoad(path, callback) {
        dust.cache[path] = require(path);
        callback();
    };
};