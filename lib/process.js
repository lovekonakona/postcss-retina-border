const postcss = require('postcss');

const media = '@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 192dpi)';

function getRetinaBorderRule(rule, decls) {
  const borderProps = getBorderProps(decls);
  if (borderProps.length > 0) {
    return createBorderRule(rule.selector, borderProps);
  }
}

function createDPRMediaQuery() {
  return postcss.parse(`${media}{}`).first;
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

function createBorderRule(selector, borderProps) {
  let innerRule = postcss.rule({selector});
  let value = '0.5PX';
  borderProps.forEach((prop) => {
    let newProp = {
      prop: prop.prop,
      value: prop.value.replace(/(\b)1px/ig, '$1' + value)
    };
    innerRule.append(newProp);
  });
  return innerRule;
}

module.exports = {getRetinaBorderRule, media, createDPRMediaQuery};
