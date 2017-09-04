var postcss = require('postcss');
var plugin = require('./');
var test = require('ava');
var {createDPRMediaQuery} = require('./lib/process');

function run(t, input, output, opts = {}) {
  return getProcessor(opts)
    .process(input)
    .then(result => {
      t.is(result.css, output);
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
  t.is(createDPRMediaQuery(1.5).toString(), mediaQueryR1p5);
  t.is(createDPRMediaQuery(2).toString(), mediaQueryR2);
  t.is(createDPRMediaQuery(2.5).toString(), mediaQueryR2p5);
  t.is(createDPRMediaQuery(3).toString(), mediaQueryR3);
});

test('border', t => {
  return run(
    t,
    `a {border: 1px solid #ccc;}, #id->div::before{border-bottom: 1px solid #333}`,
    `a {border: 1px solid #ccc;}, #id->div::before{border-bottom: 1px solid #333}${mediaQueryR2}{a {border-width: 0.5px;}, #id->div::before {border-bottom-width: 0.5px;}}`
  );
});

test('not 1px border', t => {
  return run(
    t,
    `a {border: 2px solid #ccc;}`,
    `a {border: 2px solid #ccc;}`
  );
});

test('border-top', t => {
  return run(
    t,
    `a {border-top: 1px solid #ccc;}`,
    `a {border-top: 1px solid #ccc;}${mediaQueryR2}{a {border-top-width: 0.5px;}}`
  );
});

test('border-width', t => {
  return run(
    t,
    `a {border-width: 1px solid #ccc;}`,
    `a {border-width: 1px solid #ccc;}${mediaQueryR2}{a {border-width: 0.5px;}}`
  );
});
