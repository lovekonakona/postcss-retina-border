const postcss = require('postcss');
const plugin = require('./index');
const test = require('ava');
const { media } = require('./lib/process');

function run(t, input, output, opts = {}) {
  return postcss([plugin(opts)])
    .process(input)
    .then(result => {
      t.is(output.replace(/\s+/g, ''), result.css.replace(/\s+/g, ''));
      t.is(result.warnings().length, 0);
    });
}

test('Normal border', t => {
  return run(
    t,
    `
      a {
        border: 1px solid #ccc;
      }
      #id > div:before {
        border-bottom: 1px solid #333;
      }`,
    `
      a {
        border: 1px solid #ccc;
      }
      #id > div:before{
        border-bottom: 1px solid #333;
      }
      ${media} {
        a {
          border: 0.5PX solid #ccc;
        }
        #id > div:before {
          border-bottom: 0.5PX solid #333;
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
          border-top: 0.5PX solid #ccc;
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
          border: 0.5PX solid #333;
          border-bottom: 0px;
        }
      }`
  );
});

test('Test border-width', t => {
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
          border-width: 0.5PX 2px 3px 4px;
        }
      }`
  );
});

test('Has comment', t => {
  return run(
    t,
    `
      ul {
        list-style-type: none;
        padding: 0;
        /* border: 1px solid #333; */
      }`,
    `
      ul {
        list-style-type: none;
        padding: 0;
        /* border: 1px solid #333; */
      }`
  );
});

test('"px" with uppercase letter', t => {
  return run(
    t,
    `
      ul {
        list-style-type: none;
        padding: 0;
        border: 1PX solid #333;
      }`,
    `
      ul {
        list-style-type: none;
        padding: 0;
        border: 1PX solid #333;
      }
      ${media} {
        ul {
          border: 0.5PX solid #333;
        }
      }`
  );
});
