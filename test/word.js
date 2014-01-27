/**
 * Module Dependencies
 */

var word = require('word-at-cursor');
var assert = require('assert');
var domify = require('domify');
var selection = window.getSelection;

/**
 * Tests
 */

describe('word()', function() {
  var el;

  beforeEach(function() {
    el = domify('<p>hi! my name is s<strong>a<em>ll</em>y</strong>.</p>');
    document.body.appendChild(el);
    sel = selection();
    sel.removeAllRanges();
  });

  afterEach(function() {
    document.body.removeChild(el);
  });

  it('should select textnodes', function() {
    selectAt(el, 'n');
    var range = word();
    assert('name' == range.toString());
    assert(range.endContainer == range.startContainer);
    assert('hi!' == range.startContainer.textContent.slice(0, 3));
    assert('s' == range.endContainer.textContent.slice(-1));
  })

  it('should not include punctuation', function() {
    selectAt(el, 'i');
    var range = word();
    assert('hi!' == range.toString());
    assert(range.endContainer == range.startContainer);
    assert('hi!' == range.startContainer.textContent.slice(0, 3));
    assert('s' == range.endContainer.textContent.slice(-1));
  })

  it('should span textnodes and element nodes', function() {
    selectAt(el.querySelector('em'), 'l');
    var range = word();
    assert('sally.' == range.toString());
    assert(range.endContainer != range.startContainer);
    assert('hi!' == range.startContainer.textContent.slice(0, 3));
    assert('.' == range.endContainer.textContent);
  })

})

/**
 * Selection setter utility
 *
 * @todo cross-browser
 */

function selectAt(elem, str) {
  var range = document.createRange();
  var i = elem.textContent.indexOf(str);

  // set to end
  if (~i) i++;
  else throw new Error('selectAt: unable to select');

  range.setStart(elem.firstChild, i);
  range.setEnd(elem.firstChild, i);
  sel.addRange(range);
}
