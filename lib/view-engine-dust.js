var dust = require('dustjs-linkedin');
var onLoad = require('./onLoad');

module.exports = function createEngine(config) {
    var onLoadFunc = onLoad(config);
    if (onLoadFunc) {
        dust.onLoad = onLoadFunc;
    }

    return {
        stream: function(path, input) {
            return dust.stream(path, input);
        }
    };
};