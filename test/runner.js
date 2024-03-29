/*
 * Test suite inspired/copied from Stylus
 * https://github.com/LearnBoost/stylus/blob/master/test/run.js
 */

var stylus      = require('stylus'),
    hardstop    = require('../lib/hardstop'),
    helper      = require('./test_helper');
    diff        = helper.diff,
    finish      = helper.finish,
    format      = helper.format,
    fs          = require('fs');

var count    = 0,
    failures = 0;


var tests = [
  { name: 'default' }

];

var defaults = { paths: [__dirname + '/cases'] };

function test(example, assert) {
  var sourcePath   = __dirname + '/cases/' + example.name,
      expectedPath = __dirname + '/cases/expectations/' + example.name,
      source       = fs.readFileSync(sourcePath + '.styl', 'utf-8'),
      expected     = fs.readFileSync(expectedPath + '.css', 'utf-8'),
      options      = example.options || {};

  compile(source, expected, options, assert);

  options.rename = true;
  expectedPath   = __dirname + '/cases/expectations/' + example.name + '.rename';
  expected       = fs.readFileSync(expectedPath + '.css', 'utf-8');

  compile(source, expected, options, assert);
}

function compile(source, expected, options, assert) {
  var compiler = stylus(source, defaults).use(hardstop(options));
  compiler.render(function(error, generated) {
    if(error) {
      throw error;
    }
    assert(generated, expected, options);
  });
}



tests.forEach(function(example) {
  test(example, function(actual, expected, options) {
    ++count;
    if (actual !== expected) {
      ++failures;
      console.error('\r  \033[31m✖\033[0m \033[90m%s\033[0m\n',format(example.name, options));
      diff(actual, expected);
      console.error();
    } else {
      console.log('\r  \033[36m✔\033[0m \033[90m%s\033[0m',format(example.name, options));
    }
  });
})

finish(count, failures);

