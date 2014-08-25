var req = require;
var onLoad = require('./onLoad');

// dust.debugLevel = 'DEBUG';

module.exports = function createEngine(config, viewEngine) {
    var dust = config.dust || req('dustjs-linkedin');
    config.dust = dust;

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
        buildTemplateData: function(path, templateData, context) {
            var parentDustContext = context.dustContext;
            if (parentDustContext) {
                templateData = parentDustContext.push(templateData);
            }
            templateData.templateName = path;
            templateData.stream = context.stream; // Keep a reference to the underlying stream that we are writing to
            return templateData;
        }
    };
};