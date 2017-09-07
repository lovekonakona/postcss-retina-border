var postcss = require('postcss');
var {getRetinaBorderRule, createDPRMediaQuery} = require('./lib/process');

module.exports = postcss.plugin('postcss-retina-border', function(options) {
  return function(css) {
    options = options || {};

    let borderRules = [];
    css.walkRules((rule) => {
      let retinaRule = getRetinaBorderRule(rule, rule.nodes);
      retinaRule && borderRules.push(retinaRule);
    });
    if (borderRules.length > 0) {
      let retinaBorderAtRule = createDPRMediaQuery();
      retinaBorderAtRule.append(borderRules);
      css.append(retinaBorderAtRule);
    }
  };
});
