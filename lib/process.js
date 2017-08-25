module.exports = function process(rule, decls) {
  decls.forEach((decl) => {
    if (decl.prop === 'border-width') {
      decl.remove();
    }
  })
}
