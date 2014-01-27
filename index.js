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
 * @todo IE support
 *
 * @return {Range|null}
 * @api public
 */

function word() {
  var sel = selection();
  var node = sel.focusNode;
  var offset = sel.focusOffset;
  var it = iterator(node, offset);
  var range = document.createRange();

  // go back until we hit the separator
  var ch = it.peak(-1);
  while (ch && !sep.test(ch)) {
    it.prev();
    ch = it.peak(-1);
  }

  // set the start of the range
  range.setStart(it.node, it.offset);

  // reset the iterator
  it = iterator(node, offset);

  // go forward until we hit the separator
  var ch = it.peak(1);
  while (ch && !sep.test(ch)) {
    it.next();
    ch = it.peak(1);
  }

  // set the end of the range
  range.setEnd(it.node, it.offset);

  return range;
}
