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
        buildTemplateData: function(path, templateData, out) {
            var base = out.dustContext || dust.makeBase({
                stream: out.stream
            });

            templateData = base.push(templateData);
            templateData.templateName = path;
            return templateData;
        }
    };
};