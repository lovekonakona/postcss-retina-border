// var postcss = require('postcss');

module.exports = function process(rule, decls) {
  const borders = {};
  decls.forEach((decl) => {
    if (decl.value.match(/1px/i) != null) {
      if (decl.prop.match(/border-top$/) != null) {
        borders['top'] = true;
      }

      if (decl.prop.match(/border-left$/) != null) {
        borders['left'] = true;
      }

      if (decl.prop.match(/border-right$/) != null) {
        borders['right'] = true;
      }

      if (decl.prop.match(/border-bottom$/) != null) {
        borders['bottom'] = true;
      }

      if (decl.prop.match(/border$/) != null) {
        borders['all'] = true;
      }
    }
  });

  if (Object.keys(borders).length > 0) {

  }
};
