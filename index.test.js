var postcss = require('postcss');
var plugin = require('./');
var test = require('ava');

function run(t, input, output, opts = {}) {
  return postcss([ plugin(opts) ])
    .process(input)
    .then( result => {
      t.is(result.css, output);
      t.is(result.warnings().length, 0);
    });
}

// This test passed.
test('Remove border-width', t => {
  return run(
    t,
    `a{
    border-width: 1px solid #ccc;
}`,
    `a{
}`
  );
});
