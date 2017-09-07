const postcss = require('postcss');

function process(rule, decls) {
  const borderProps = getBorderProps(decls);
  if (borderProps.length > 0) {
    const root = rule.root();
    let ratio = 2;
    const retinaBorderAtRule = insertDPRMediaQuery(root, ratio);
    const innerRule = createBorderRule(rule.selector, borderProps, ratio);
    retinaBorderAtRule.append(innerRule);
  }
};

function createDPRMediaQuery(ratio = 2) {
  return postcss.parse(`@media only screen and (-webkit-min-device-pixel-ratio: ${ratio}), only screen and (min--moz-device-pixel-ratio: ${ratio}), only screen and (min-resolution: ${ratio}dppx), only screen and (min-resolution: ${ratio * 96}dpi){}`).first;
}

function getBorderProps(decls) {
  let borderProps = [];
  let has1pxProp = false;
  decls.forEach((decl) => {
    if (typeof decl.prop === 'string' && decl.prop.match(/border(-(top|left|right|bottom))?(-width)?$/) != null) {
      if (decl.value.match(/\b1px/i) != null) {
        has1pxProp = true;
      }
      borderProps.push({prop: decl.prop, value: decl.value});
    }
  });
  if (!has1pxProp) {
    borderProps = [];
  }
  return borderProps;
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

function createBorderRule(selector, borderProps, ratio = 2) {
  let innerRule = postcss.rule({selector});
  let value = `${Math.floor(1 / ratio * 100000) / 100000}px`;
  borderProps.forEach((prop) => {
    let newProp = {
      prop: prop.prop,
      value: prop.value.replace(/(\b)1px/g, '$1' + value)
    };
    innerRule.append(newProp);
  });
  return innerRule;
}

module.exports = {process, createDPRMediaQuery};
