const postcss = require('postcss');
const plugin = require('./');
const test = require('ava');
const {createDPRMediaQuery} = require('./lib/process');
const cssbeautify = require('cssbeautify');

function format(cssStr) {
  return cssbeautify(cssStr, {indent: '  '});
}

function run(t, input, output, opts = {}) {
  return getProcessor(opts)
    .process(input)
    .then(result => {
      t.is(format(result.css), format(output));
      t.is(result.warnings().length, 0);
    });
}

function getProcessor(opts = {}) {
  return postcss([ plugin(opts) ]);
}

const mediaQueryR1p5 = '@media only screen and (-webkit-min-device-pixel-ratio: 1.5), only screen and (min--moz-device-pixel-ratio: 1.5), only screen and (min-resolution: 1.5dppx), only screen and (min-resolution: 144dpi)';
const mediaQueryR2 = '@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 192dpi)';
const mediaQueryR2p5 = '@media only screen and (-webkit-min-device-pixel-ratio: 2.5), only screen and (min--moz-device-pixel-ratio: 2.5), only screen and (min-resolution: 2.5dppx), only screen and (min-resolution: 240dpi)';
const mediaQueryR3 = '@media only screen and (-webkit-min-device-pixel-ratio: 3), only screen and (min--moz-device-pixel-ratio: 3), only screen and (min-resolution: 3dppx), only screen and (min-resolution: 288dpi)';

test('createDPRMediaQuery', t => {
  t.is(createDPRMediaQuery(1.5).toString(), mediaQueryR1p5 + '{}');
  t.is(createDPRMediaQuery(2).toString(), mediaQueryR2 + '{}');
  t.is(createDPRMediaQuery(2.5).toString(), mediaQueryR2p5 + '{}');
  t.is(createDPRMediaQuery(3).toString(), mediaQueryR3 + '{}');
});

test('border', t => {
  return run(
    t,
    `a {border: 1px solid #ccc;} #id->div::before{border-bottom: 1px solid #333;}`,
    `a {border: 1px solid #ccc;} #id->div::before{border-bottom: 1px solid #333;}${mediaQueryR2}{a {border: 0.5px solid #ccc;} #id->div::before {border-bottom: 0.5px solid #333;}}`
  );
});

test('not 1px border', t => {
  return run(
    t,
    `a {border: 2px solid #ccc;} .no-border{border: 0px;}`,
    `a {border: 2px solid #ccc;} .no-border{border: 0px;}`
  );
});

test('border-top', t => {
  return run(
    t,
    `a {border-top: 1px solid #ccc;}`,
    `a {border-top: 1px solid #ccc;}${mediaQueryR2}{a {border-top: 0.5px solid #ccc;}}`
  );
});

test('minxin border props 1', t => {
  return run(
    t,
    `a {border: 1px solid #333; border-bottom: 0px;}`,
    `a {border: 1px solid #333; border-bottom: 0px;}${mediaQueryR2}{a {border: 0.5px solid #333; border-bottom: 0px;}}`
  );
});

test('minxin border props 2', t => {
  return run(
    t,
    `a {border: 4px solid #333; border-bottom: 1px;}`,
    `a {border: 4px solid #333; border-bottom: 1px;}${mediaQueryR2}{a {border: 4px solid #333; border-bottom: 0.5px;}}`
  );
});

test('minxin border props 3', t => {
  return run(
    t,
    `a {border: 4px solid #333; border-bottom: 2px;}`,
    `a {border: 4px solid #333; border-bottom: 2px;}`
  );
});

test('border-width', t => {
  return run(
    t,
    `a {border-width: 1px 2px 3px 4px;}`,
    `a {border-width: 1px 2px 3px 4px;}${mediaQueryR2}{a {border-width: 0.5px 2px 3px 4px;}}`
  );
});

test('border', t=>{
  return run(
    t,
    `ul[data-v-f1d9a974] {
      list-style-type: none;
      padding: 0;
      /* border: 1px solid #333; */
    }`,
    `ul[data-v-f1d9a974] {
      list-style-type: none;
      padding: 0;
      /* border: 1px solid #333; */
    }`
  );
});
