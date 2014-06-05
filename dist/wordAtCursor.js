;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("matthewmueller-dom-iterator/index.js", function(exports, require, module){
/**
 * Module Dependencies
 */

var slice = Array.prototype.slice;

/**
 * Export `iterator`
 */

module.exports = iterator;

/**
 * Initialize `iterator`
 *
 * @param {Node} node
 */

function iterator(node) {
  if (!(this instanceof iterator)) return new iterator(node);
  this.node = this.start = node;
  this.types = false;
}

/**
 * Filter on the type
 *
 * @param {Number, ...} filters
 * @return {iterator}
 * @api public
 */

iterator.prototype.filter = function() {
  var args = slice.call(arguments);
  var types = this.types = this.types || {};

  for (var i = 0, len = args.length; i < len; i++) {
    types[args[i]] = true;
  }

  return this;
};

/**
 * Reset the iterator
 *
 * @param {Element} node (optional)
 * @return {iterator}
 * @api public
 */

iterator.prototype.reset = function(node) {
  this.node = node || this.start;
  return this;
};

/**
 * Next node
 *
 * @param {Number} type
 * @return {Element|null}
 * @api public
 */

iterator.prototype.next = traverse('nextSibling', 'firstChild');

/**
 * Previous node
 *
 * @param {Number} type
 * @return {Element|null}
 * @api public
 */

iterator.prototype.previous =
iterator.prototype.prev = traverse('previousSibling', 'lastChild');

/**
 * Make traverse function
 *
 * @param {String} dir
 * @param {String} child
 * @return {Function}
 * @api private
 */

function traverse(dir, child) {
  return function walk() {
    var start = this.start;
    var node = this.node;
    var types = this.types;
    var climbing = false;

    while (node) {
      if (!climbing && node[child]) {
        node = node[child];
      } else if (node[dir]) {
        node = node[dir];
        climbing = false;
      } else {
        node = node.parentNode;
        climbing = true;
        continue;
      }

      if (!types || types[node.nodeType]) {
        this.node = node;
        return node;
      }
    }

    return null;
  };
}

});
require.register("matthewmueller-character-iterator/index.js", function(exports, require, module){
/**
 * Module dependencies
 */

var it = require('dom-iterator');

/**
 * Export `Iterator`
 */

module.exports = Iterator;

/**
 * Initialize `Iterator`
 *
 * @param {TextNode} node
 * @param {Number} offset
 * @param {Node} root
 * @return {Iterator}
 * @api public
 */

function Iterator(node, offset, root) {
  if (!(this instanceof Iterator)) return new Iterator(node, offset, root);
  this.it = it(node).filter(Node.TEXT_NODE);
  this.node = node || this.it.start;
  this.offset = offset || 0;
  this.root = root || null;
  this.text = (3 == this.node.nodeType) ? this.node.nodeValue : null;
}

/**
 * Next character
 *
 * @return {String} ch
 * @api public
 */

Iterator.prototype.next = function() {
  this.peaked = null;
  var root = this.root;
  var node;

  // initial setup when `this.node` isnt a text node
  if (!this.text) {
    node = this.it.next();
    if (!node || higher(node, root)) return null;
    this.node = node;
    this.text = this.node.nodeValue;
  }

  var ch = this.text[this.offset++];

  while (!ch) {
    node = this.it.next();
    if (!node || higher(node, root)) return null;
    this.node = node;
    this.text = node.nodeValue;
    this.offset = 0;
    ch = this.text[this.offset++];
  }

  return ch;
};

/**
 * Previous character
 *
 * @return {String} ch
 * @api public
 */

Iterator.prototype.previous =
Iterator.prototype.prev = function() {
  this.peaked = null;
  var root = this.root;
  var node;

  // initial setup when `this.node` isnt a text node
  if (!this.text) {
    node = this.it.prev();
    if (!node || higher(node, root)) return null;
    this.node = node;
    this.text = this.node.nodeValue;
  }

  var ch = this.text[--this.offset];

  while (!ch) {
    node = this.it.prev();
    if (!node || higher(node, root)) return null;
    this.node = node;
    this.text = node.nodeValue;
    this.offset = this.text.length;
    ch = this.text[--this.offset];
  }

  return ch;
};

/**
 * Peak in either direction
 * `n` nodes. Peak backwards
 * using negative numbers.
 *
 * @param {Number} n (optional)
 * @return {Node|null}
 * @api public
 */

Iterator.prototype.peak = function(n) {
  n = undefined == n ? 1 : n;
  var peaked = this.peaked = this.peaked || new Iterator(this.node, this.offset, this.root);

  if (!n) return null;
  else if (n > 0) while(n--) node = peaked.next();
  else while(n++) node = peaked.prev();
  return node;
}

/**
 * Utility: Check if node is higher
 * than root. Also checks if root
 * exists
 *
 * @param {Node} node
 * @param {Node} root
 * @return {Boolean}
 * @api private
 */

function higher(node, root) {
  return root && !root.contains(node);
}

});
require.register("word-at-cursor/index.js", function(exports, require, module){
/**
 * Module Dependencies
 */

var selection = window.getSelection;
var iterator = require('character-iterator');

/**
 * Expose `word`
 */

exports = module.exports = word;

/**
 * Word separator
 */

var sep = exports.separator = /\s/

/**
 * Get the word at the cursor
 *
 * TODO: IE support
 *
 * @param {Node} root (optional)
 * @return {Range|null}
 * @api public
 */

function word(root) {
  var sel = selection();
  var node = sel.focusNode;
  var offset = sel.focusOffset;
  var range = document.createRange();
  var b = 0, f = 0;

  // go back until we hit the separator
  var back = iterator(node, offset, root)
  var ch = back.peak(-1);
  while (ch && !sep.test(ch)) {
    b++;
    back.prev();
    ch = back.peak(-1);
  }

  // set the start of the range
  range.setStart(back.node, back.offset);

  // go forward until we hit the separator
  var next = iterator(node, offset, root)
  var ch = next.peak(1);
  while (ch && !sep.test(ch)) {
    f++;
    next.next();
    ch = next.peak(1);
  }

  // set the end of the range
  range.setEnd(next.node, next.offset);

  // extend range to support total back and forward
  range.back = b;
  range.forward = f;

  return range;
}

});
require.alias("matthewmueller-character-iterator/index.js", "word-at-cursor/deps/character-iterator/index.js");
require.alias("matthewmueller-character-iterator/index.js", "word-at-cursor/deps/character-iterator/index.js");
require.alias("matthewmueller-character-iterator/index.js", "character-iterator/index.js");
require.alias("matthewmueller-dom-iterator/index.js", "matthewmueller-character-iterator/deps/dom-iterator/index.js");
require.alias("matthewmueller-dom-iterator/index.js", "matthewmueller-character-iterator/deps/dom-iterator/index.js");
require.alias("matthewmueller-dom-iterator/index.js", "matthewmueller-dom-iterator/index.js");
require.alias("matthewmueller-character-iterator/index.js", "matthewmueller-character-iterator/index.js");
require.alias("word-at-cursor/index.js", "word-at-cursor/index.js");if (typeof exports == "object") {
  module.exports = require("word-at-cursor");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return require("word-at-cursor"); });
} else {
  this["wordAtCursor"] = require("word-at-cursor");
}})();