# @peteanderson/ansi

ANSI escape sequence helpers for Node.js terminal output. Automatically detects terminal
capabilities and adapts output accordingly.

## Installation

```sh
npm install @peteanderson/ansi
```

## Usage

The examples below use `require()`, but `import` works identically for ESM and TypeScript
consumers — just substitute `import ansi from` for `const ansi = require`, and so on.

```js
// Use directly as a namespace
const ansi = require("@peteanderson/ansi");
console.log(ansi.fg.red("error: something went wrong"));
console.log(ansi.bg.blue.and.fg.white.and.bold("highlighted"));

// Call it to build a custom instance
const ansiNoColor = ansi(24); // force 24-bit (true color)
console.log(ansiNoColor.fg.rgb(255, 128, 64)("light red-orange"));

// Destructure named exports
const {ansi: defaultInstance, makeAnsi, fg} = require("@peteanderson/ansi");
console.log(fg.red.and.bold("Hello, world!"));
const custom = makeAnsi({colorDepth: 8, caret: false});
```

## Feature Detection

The module automatically detects:

- **Color depth**: 1 (none), 4 (16 colors), 8 (256 colors), 24 (true color)
- **Style support**: enabled if color depth > 1
- **Other features**: caret, erase, scroll — enabled if output is a TTY and `TERM` is not `dumb`

When disabled, features output empty strings. Color outputs plain text. This can be overridden:

- Pass a boolean to force color on/off
- Pass a number to set specific color depth (1, 3, 4, 8, or 24)
- Pass a stream to use for detection
- Pass a partial features object to override individual features

## API

### Default Export

The default export is both the pre-built default instance and a callable factory. You can use it
directly as a namespace, call it to build a custom instance, or destructure properties from it:

```js
const ansi = require("@peteanderson/ansi");

console.log(ansi.fg.red("hello"));   // use as instance
const custom = ansi(true);           // call as factory
console.log(custom.fg.red("hello")); // forced color
```

### `makeAnsi(options?)`

The factory function, exported as a named export. Returns a configured instance. Equivalent to
calling the default export as a function, but exported separately for consumers who want a plain
function reference:

```ts
import {makeAnsi} from "@peteanderson/ansi";
const custom = makeAnsi(true);
```

### `ansi`

The pre-built default instance, exported as a named export. Unlike the default export, this is not
callable — use `makeAnsi` if you need to build a custom instance:

```ts
import {ansi, makeAnsi} from "@peteanderson/ansi";
console.log(ansi.fg.red("hello"));
```

### `fg` — foreground colors

Functions that wrap text with color codes (or plain text if disabled):

- Basic colors: `black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `default`
- Bright colors: `brightBlack` `brightRed` `brightGreen` `brightYellow` `brightBlue` `brightMagenta`
  `brightCyan` `brightWhite`
- `fg.rgb(r, g, b)(text)` - 24-bit RGB color, downscaled for lower color depths
- `fg.x256(code)(text)` or `fg.x256(r, g, b)(text)` - 256-color palette, downscaled as needed

All return functions with `open` and `close` properties for raw sequences and an `and` property for
fluent chaining.

### `bg` — background colors

Functions that wrap text with color codes (or plain text if disabled):

- Basic colors: `black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `default`
- Bright colors: `brightBlack` `brightRed` `brightGreen` `brightYellow` `brightBlue` `brightMagenta`
  `brightCyan` `brightWhite`
- `bg.rgb(r, g, b)(text)` - 24-bit RGB color, downscaled for lower color depths
- `bg.x256(code)(text)` or `bg.x256(r, g, b)(text)` - 256-color palette, downscaled as needed

All return functions with `open` and `close` properties for raw sequences and an `and` property for
fluent chaining.

### `style`

Functions that wrap text with style codes (disabled if color depth = 1):

`bold` `dim` `italic` `underline` `inverse` `hidden` `strikethrough` `doubleUnderline` `framed`
`encircled` `overline`

All return functions with `open` and `close` properties for raw sequences and an `and` property for
fluent chaining.

#### Fluent Chaining with `.and`

Styles can be chained using the `.and` property for a natural, fluent interface. The `style`
namespace is unnested in chains:

```js
// Top-level: use style namespace
ansi.style.bold("bold text");

// In a chain: no need for style namespace
console.log(ansi.fg.white.and.bg.blue.and.bold("white on blue, bold"));
console.log(ansi.fg.red.and.underline("red underlined"));
```

#### Arbitrary Style Combination with `.combine()`

Arbitrary styles can be combined using the `.combine()` method on any SGR function. This allows you
to combine any styles into a single function, which can then be applied to text:

```js
const dim = format => format.combine(ansi.style.dim);

console.log(dim(ansi.fg.red("dim red text")));
```

### `reset`

The SGR reset sequence. Empty string if color is disabled.

### `plain`

An identity formatter that returns its input string unchanged. Useful for conditionally disabling
formatting or for testing:

```js
function formatText(text, useColor) {
    const format = useColor ? ansi.fg.green : ansi.plain;
    return format.and.bold(text);
}
```

### `caret`

Available if feature is enabled:

- `caret.show` / `caret.hide` - show or hide the cursor
- `caret.position.get` - get the current cursor position (terminal sends position to stdin)
- `caret.position.set(row, col)` - set cursor position (1-based indexing)
- `caret.shape.block` / `caret.shape.underline` / `caret.shape.bar` - change cursor shape
- `caret.up(n)` / `caret.down(n)` / `caret.forward(n)` / `caret.backward(n)` - move cursor
- `caret.nextLine(n)` / `caret.prevLine(n)` - move cursor to next/previous line
- `caret.x(col)` - move cursor to column (1-based)
- `caret.save` / `caret.restore` - save/restore cursor position (VT100)

### `terminal`

Terminal control features (available if feature is enabled):

- `terminal.focusReporting.enable` / `terminal.focusReporting.disable` - enable/disable focus
  reporting
- `terminal.alternateBuffer.on` / `terminal.alternateBuffer.off` - switch to/from alternate buffer
- `terminal.alternateBuffer.legacy.on` / `terminal.alternateBuffer.legacy.off` - use legacy
  alternate buffer sequences
- `terminal.bracketedPasteMode.enable` / `terminal.bracketedPasteMode.disable` - enable/disable
  bracketed paste mode

### `erase`

Available if feature is enabled:

- `erase.line.toStart` / `erase.line.toEnd` / `erase.line.full` - erase line
- `erase.screen.toStart` / `erase.screen.toEnd` / `erase.screen.full` - erase screen
- `erase.screen.scrollback` - erase screen and scrollback buffer

### `scroll`

Available if feature is enabled:

- `scroll.up(lines)` - scroll up (default 1 line)
- `scroll.down(lines)` - scroll down (default 1 line)

### `strip(text)`

Removes all ANSI CSI sequences from a string (always available).

### `slice(text, start, end)`

Slices a string by visible characters, ignoring ANSI sequences (always available).

### `sanitize(text)`

Removes "unsafe" CSI sequences, leaving only color and style codes (always available).

### `simplify(text)`

Simplifies ANSI SGR sequences by combining adjacent sequences and removing redundant codes (always
available).

### `visibleLength(text)`

Returns the visible length of a string with all ANSI sequences removed (always available).

### `padStart(text, targetLength)` and `padEnd(text, targetLength)`

Pads a string to a target visible length using spaces. Accounts for ANSI sequences when calculating
length.

### `features`

Object containing the detected feature configuration:

```ts
{
    colorDepth : 1 | 3 | 4 | 8 | 24;
    style      : boolean;
    caret      : boolean;
    erase      : boolean;
    scroll     : boolean;
    terminal   : boolean;
}
```

## License

MIT