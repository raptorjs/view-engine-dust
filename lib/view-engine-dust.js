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
            var attributes = out.attributes;
            var base = attributes.dustBase;

            if (!base) {
                // Make sure all Dust context objects use the "attributes"
                // as their global so that attributes are carried across
                // rendering calls
                attributes.stream = out.stream;
                base = attributes.dustBase = dust.makeBase(attributes);
            }

            if (out.dustContext) {
                base = out.dustContext.push(base);
            }

            templateData = base.push(templateData);
            templateData.templateName = path;
            return templateData;
        }
    };
};