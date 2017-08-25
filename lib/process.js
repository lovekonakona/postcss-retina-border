var postcss = require('postcss');
var getBorderImage = require('./border-image');

module.exports = function process(rule, decls) {
  decls.forEach((decl) => {
    if (decl.prop === 'border-width') {
      decl.remove();
    }
    // rule.append(
    //   postcss.decl({ prop: 'color', value: 'red' })
    // );
  });
};
