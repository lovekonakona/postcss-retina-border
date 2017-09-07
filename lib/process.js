const postcss = require('postcss');

const media = '@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 192dpi)';

function process(rule, decls) {
  const borderProps = getBorderProps(decls);
  if (borderProps.length > 0) {
    const root = rule.root();
    const retinaBorderAtRule = insertDPRMediaQuery(root);
    const innerRule = createBorderRule(rule.selector, borderProps);
    retinaBorderAtRule.append(innerRule);
  }
};

function createDPRMediaQuery() {
  return postcss.parse(`${media}`).first;
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

function insertDPRMediaQuery(root) {
  let retinaBorderAtRule = null;
  const privateKey = '__retinaBorderAtRules2';
  if (!root[privateKey]) {
    retinaBorderAtRule = root[privateKey] = root.append(createDPRMediaQuery());
  } else {
    retinaBorderAtRule = root[privateKey];
  }
  return retinaBorderAtRule;
}

function createBorderRule(selector, borderProps) {
  let innerRule = postcss.rule({selector});
  let value = `${Math.floor(1 / 2 * 100000) / 100000}px`;
  borderProps.forEach((prop) => {
    let newProp = {
      prop: prop.prop,
      value: prop.value.replace(/(\b)1px/g, '$1' + value)
    };
    innerRule.append(newProp);
  });
  return innerRule;
}

module.exports = {process, media};
