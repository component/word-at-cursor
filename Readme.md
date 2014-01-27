
# word-at-cursor

  get the current word at the cursor of any textarea or contenteditable element.

## Example

```js
var range = word();
range.toString() // word
range.startContainer // start node
range.endContainer // end node
```

## Installation

  Install with [component(1)](http://component.io):

    $ component install component/word-at-cursor

## API

### `word([root])`

Get the word at the cursor. Returns a [range](https://developer.mozilla.org/en-US/docs/Web/API/range). Optionally add a `root` element that the word will not extend outside of.

## Test

```
npm install component-test
make test
```

## License

  MIT
