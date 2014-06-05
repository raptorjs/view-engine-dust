var dust = require('dustjs-linkedin');
var onLoad = require('./onLoad');

// dust.debugLevel = 'DEBUG';

module.exports = function createEngine(config, viewEngine) {
    var onLoadFunc = onLoad(config);
    if (onLoadFunc) {
        dust.onLoad = onLoadFunc;
    }

    return {
        stream: function(path, templateData) {
            if (!templateData) {
                templateData = {};
            }

            return dust.stream(path, templateData);
        },
        buildTemplateData: function(templateData, context) {
            var parentDustContext = context.dustContext;
            if (parentDustContext) {
                templateData = parentDustContext.push(templateData);
            }
            return templateData;
        }
    };
};

module.exports.dust = dust;