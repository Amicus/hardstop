var stylus     = require('stylus'),
    nodes      = stylus.nodes,
    parse      = require('url').parse,
    extname    = require('path').extname,
    basename   = require('path').basename,
    strategies = require('./strategies');

module.exports = function(options) {
  var strategy = strategies[options.strategy];

  function rename(url, hardstop) {
    pathname  = basename(url.pathname);
    extension = extname(url.pathname);
    filename  = pathname.replace(extension, '');
    replaced  = [filename, '-', hardstop, extension].join('');

    return url.href.replace(pathname, replaced);
  }

  function format(url) {
    return new nodes.Literal('url("' + url + '")');
  }

  function plugin(url) {

    url = parse(url.toString());

    var hardstop = strategy(url, options);
    var literal = url.href;

    if(!hardstop) {
      return format(literal);
    }

    if(options.rename) {
      literal = rename(url, hardstop);
    } else {
      literal = [literal, hardstop].join('?');
    }

    return format(literal);
  };

  return plugin;
};