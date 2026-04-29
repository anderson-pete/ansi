# @peteanderson/ansi

ANSI escape sequence helpers for Node.js terminal output.

## Installation

```sh
npm install @peteanderson/ansi
```

## Usage

```js
const ansi = require("@peteanderson/ansi");

console.log(ansi.fg.red + "error: something went wrong" + ansi.fg.default);
console.log(ansi.bg.blue + ansi.fg.white + "highlighted" + ansi.fg.default + ansi.bg.default);
console.log(ansi.erase.screen);
console.log(ansi.caret.show);
```

## API

### `fg` — foreground colors

Raw ANSI open sequences: `black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `default`

### `bg` — background colors

Raw ANSI open sequences: `black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `default`

### `style`

`underline` `reverse` (raw sequences)

### `caret`

- `show` / `hide` - show or hide the cursor
- `position.get` - get the current cursor position (terminal sends position to stdin)
- `position.set(row, col)` - set cursor position (1-based indexing)
- `shape.block` / `shape.underline` / `shape.bar` - change cursor shape

### `erase`

Raw sequences:
- `erase.line.toStart` / `erase.line.toEnd` / `erase.line.full`
- `erase.screen`

### `scroll`

- `scroll.up(lines)` - scroll up (default 1 line)
- `scroll.down(lines)` - scroll down (default 1 line)

### `strip(text)`

Removes ANSI CSI sequences from a string.

## License

MIT