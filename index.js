var postcss = require('postcss');
var process = require('./lib/process');

module.exports = postcss.plugin('postcss-retina-border', function(options) {
  return function(css) {
    options = options || {};

    css.walkRules((rule) => {
      process(rule, rule.nodes);
    });
  };
});
