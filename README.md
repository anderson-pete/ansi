# @peteanderson/ansi

ANSI escape sequence helpers for Node.js terminal output. Automatically disables color when stdout is not a TTY or when standard environment variables (`NO_COLOR`, `NODE_DISABLE_COLORS`, `FORCE_COLOR`, `TERM=dumb`) indicate it should be.

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
console.log("some styled text" + ansi.reset);
console.log(ansi.stripAnsiSequences("\x1b[31mred\x1b[0m")); // => "red"
```

## API

All color and style functions accept a string and return a string. When color is disabled, the functions are identity — they return the input unchanged.

### `fg` — foreground colors

`black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `gray`

```js
ansi.fg.red("text")
ansi.fg.rgb(r, g, b)("text")  // r, g, b in 0–5 for the 6×6×6 cube, or grayscale 232–255
```

### `bg` — background colors

`black` `red` `green` `yellow` `blue` `magenta` `cyan` `white`

```js
ansi.bg.green("text")
ansi.bg.rgb(r, g, b)("text")
```

### `style`

`bold` `dim` `italic` `underline` `inverse` `hidden` `strikethrough`

```js
ansi.style.bold("text")
ansi.style.italic(ansi.style.bold("text"))
```

### `reset`

The SGR reset sequence (`\x1b[0m`). An empty string when color is disabled.

### `stripAnsiSequences(text)`

Removes ANSI SGR escape sequences from a string.

## License

MIT