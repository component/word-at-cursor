/**
 * Module Dependencies
 */

var selection = window.getSelection;

/**
 * Expose `word`
 */

module.exports = word;

/**
 * Get the word at the cursor
 *
 * @return {Range|null}
 * @api public
 */

function word() {
  var sel = selection ? selection() : document.selection;
  var range = null;

  if (sel.modify) {
    // Webkit, FF
    var original = sel.getRangeAt(0);
    sel.collapseToStart();
    sel.modify('move', 'backward', 'word');
    sel.modify('extend', 'forward', 'word');

    range = sel.getRangeAt(0);

    sel.removeAllRanges();
    sel.addRange(original);
    return range;
  } else if (sel.type != 'Control') {
    // IE
    range = sel.createRange();
    range.collapse(true);
    range.expand('word');
  }

  return range;
}
