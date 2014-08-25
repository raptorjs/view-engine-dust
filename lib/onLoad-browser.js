module.exports = function(config) {
    return function onLoad(path, callback) {
        dust = config.dust;
        dust.cache[path] = require(path);
        callback();
    };
};