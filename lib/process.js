const postcss = require('postcss');

function process(rule, decls) {
  const borderWidthProps = getBorderWidthProps(decls);
  if (borderWidthProps.length > 0) {
    const root = rule.root();
    let ratio = 2;
    const retinaBorderAtRule = insertDPRMediaQuery(root, ratio);
    const innerRule = createBorderWidthRule(rule.selector, borderWidthProps, ratio);
    retinaBorderAtRule.append(innerRule);
  }
};

function createDPRMediaQuery(ratio = 2) {
  return postcss.parse(`@media only screen and (-webkit-min-device-pixel-ratio: ${ratio}), only screen and (min--moz-device-pixel-ratio: ${ratio}), only screen and (min-resolution: ${ratio}dppx), only screen and (min-resolution: ${ratio * 96}dpi)`).first;
}

function getBorderWidthProps(decls) {
  let borderWidthProps = [];
  decls.forEach((decl) => {
    if (decl.value.match(/1px/i) != null) {
      if (decl.prop.match(/border-top$|border-left$|border-right$|border-bottom$|border$/) != null) {
        borderWidthProps.push(decl.prop + '-width');
      }
      if (decl.prop.match(/border-top-width$|border-left-width$|border-right-width$|border-bottom-width$|border-width$/) != null) {
        borderWidthProps.push(decl.prop);
      }
    }
  });
  return borderWidthProps;
}

function insertDPRMediaQuery(root, ratio = 2) {
  let retinaBorderAtRule = null;
  const privateKey = '__retinaBorderAtRules' + ratio;
  if (!root[privateKey]) {
    retinaBorderAtRule = root[privateKey] = createDPRMediaQuery(ratio);
    root.append(retinaBorderAtRule);
  } else {
    retinaBorderAtRule = root[privateKey];
  }
  return retinaBorderAtRule;
}

function createBorderWidthRule(selector, borderWidthProps, ratio = 2) {
  let innerRule = postcss.rule({selector});
  let value = `${Math.floor(1 / ratio * 100000) / 100000}px`;
  borderWidthProps.forEach((prop) => innerRule.append({prop, value}));
  return innerRule;
}

module.exports = {process, createDPRMediaQuery};
