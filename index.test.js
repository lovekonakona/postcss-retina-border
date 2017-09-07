const postcss = require('postcss');
const plugin = require('./index');
const test = require('ava');
const { createDPRMediaQuery } = require('./lib/process');

function run(t, input, output, opts = {}) {
  return postcss([plugin(opts)])
    .process(input)
    .then(result => {
      t.is(result.css.replace(/\s+/g, ''), output.replace(/\s+/g, ''));
      t.is(result.warnings().length, 0);
    });
}

const media = createDPRMediaQuery(2).toString();

test('Normal border', t => {
  return run(
    t,
    `
      a {
        border: 1px solid #ccc;
      }
      #id > div::before {
        border-bottom: 1px solid #333;
      }`,
    `
      a {
        border: 1px solid #ccc;
      }
      #id > div::before{
        border-bottom: 1px solid #333;
      }
      ${media} {
        a {
          border: 0.5px solid #ccc;
        }
        #id > div::before {
          border-bottom: 0.5px solid #333;
        }
      }`
  );
});

test('Not have 1px', t => {
  return run(
    t,
    `
      a {
        border: 2px solid #ccc;
      }
      .no-border {
        border: 0px;
      }`,
    `
      a {
        border: 2px solid #ccc;
      }
      .no-border {
        border: 0px;
      }`
  );
});

test('One direction', t => {
  return run(
    t,
    `
      a {
        border-top: 1px solid #ccc;
      }`,
    `
      a {
        border-top: 1px solid #ccc;
      }
      ${media} {
        a {
          border-top: 0.5px solid #ccc;
        }
      }`
  );
});

test('Mutiple border prop', t => {
  return run(
    t,
    `
      a {
        border: 1px solid #333;
        border-bottom: 0px;
      }`,
    `
      a {
        border: 1px solid #333;
        border-bottom: 0px;
      }
      ${media} {
        a {
          border: 0.5px solid #333;
          border-bottom: 0px;
        }
      }`
  );
});

test('minxin border props 2', t => {
  return run(
    t,
    `
      a {
        border: 4px solid #333;
        border-bottom: 1px;
      }`,
    `
      a {
        border: 4px solid #333;
        border-bottom: 1px;
      }
      ${media} {
        a {
          border: 4px solid #333;
          border-bottom: 0.5px;
        }
      }`
  );
});

test('test border-width', t => {
  return run(
    t,
    `
      a {
        border-width: 1px 2px 3px 4px;
      }`,
    `
      a {
        border-width: 1px 2px 3px 4px;
      }
      ${media} {
        a {
          border-width: 0.5px 2px 3px 4px;
        }
      }`
  );
});
