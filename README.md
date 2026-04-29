# @peteanderson/ansi

ANSI escape sequence helpers for Node.js terminal output.

## Installation

```sh
npm install @peteanderson/ansi
```

## Usage

```js
const ansi = require("@peteanderson/ansi");

console.log(ansi.fg.red("error: something went wrong"));
console.log(ansi.bg.blue(ansi.fg.white("highlighted")));
console.log(ansi.style.bold("important"));
console.log(ansi.fg.rgb(5, 2, 0)("custom color"));
console.log(ansi.strip("styled text")); // remove all ANSI codes
console.log(ansi.slice("styled text", 0, 5)); // slice by visible length
```

## API

### `fg` — foreground colors

Functions that wrap text with color codes:

- Basic colors: `black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `default`
- Bright colors: `brightBlack` `brightRed` `brightGreen` `brightYellow` `brightBlue` `brightMagenta`
  `brightCyan` `brightWhite`
- `fg.rgb(r, g, b)(text)` - 24-bit RGB color (r, g, b in 0–5 or grayscale 232–255)
- `fg.x256(code)(text)` - 256-color palette

All return functions with `open` and `close` properties for raw sequences.

### `bg` — background colors

Functions that wrap text with color codes:

- Basic colors: `black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `default`
- Bright colors: `brightBlack` `brightRed` `brightGreen` `brightYellow` `brightBlue` `brightMagenta`
  `brightCyan` `brightWhite`
- `bg.rgb(r, g, b)(text)` - 24-bit RGB color
- `bg.x256(code)(text)` - 256-color palette

### `style`

Functions that wrap text with style codes:

`bold` `dim` `italic` `underline` `inverse` `hidden` `strikethrough` `doubleUnderline` `framed`
`encircled` `overline`

All return functions with `open` and `close` properties for raw sequences.

### `caret`

- `caret.show` / `caret.hide` - show or hide the cursor
- `caret.position.get` - get the current cursor position (terminal sends position to stdin)
- `caret.position.set(row, col)` - set cursor position (1-based indexing)
- `caret.shape.block` / `caret.shape.underline` / `caret.shape.bar` - change cursor shape
- `caret.up(n)` / `caret.down(n)` / `caret.forward(n)` / `caret.backward(n)` - move cursor
- `caret.nextLine(n)` / `caret.prevLine(n)` - move cursor to next/previous line
- `caret.x(col)` - move cursor to column (1-based)
- `caret.save` / `caret.restore` - save/restore cursor position (VT100)

### `erase`

- `erase.line.toStart` / `erase.line.toEnd` / `erase.line.full` - erase line
- `erase.screen.toStart` / `erase.screen.toEnd` / `erase.screen.full` - erase screen
- `erase.screen.scrollback` - erase screen and scrollback buffer

### `scroll`

- `scroll.up(lines)` - scroll up (default 1 line)
- `scroll.down(lines)` - scroll down (default 1 line)

### `strip(text)`

Removes all ANSI CSI sequences from a string.

### `slice(text, start, end)`

Slices a string by visible characters, ignoring ANSI sequences. Works like `String.prototype.slice`
but counts only visible characters.

### `sanitize(text)`

Removes "unsafe" CSI sequences (non-SGR), leaving only color and style codes.

## License

MIT