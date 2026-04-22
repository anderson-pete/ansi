# Changelog

## [0.1.1] - 2026-04-22
### Added
 - `strip()` for removing ANSI sequences from a string
 - `slice()` for slicing a string by visible characters, ignoring ANSI sequences

## [0.1.0] - 2026-04-22
### Added
 - `fg.default` and `bg.default` to reset colors
 - `erase` for clearing the screen or current line, in whole or in part
 - `caret` for showing/hiding the cursor, getting/setting its position, and changing its shape
 - `scrollUp()` and `scrollDown()`

### Changed
 - Replaced `color.js` with `ansi.js`, merged in from a sibling library. This is an early,
   incomplete merge — several features are temporarily missing and will return in later versions
 - Color and style properties are now raw ANSI open sequences rather than functions that wrap a
   string with open/close sequences
 - Color support detection is more thorough, no longer just a TTY/env-var check

### Removed
 - `style` now provides only `underline` and `reverse` (previously also `bold`, `dim`, `italic`,
   `inverse`, `hidden`, and `strikethrough`)
 - `fg.gray` (bright black)
 - 4-bit color support (colors are 3-bit only for now)
 - `stripAnsiSequences()`

## [0.0.1] - 2026-04-22
### Added
 - `fg`, `bg`, and `style` functions for ANSI color and text styling
 - `stripAnsiSequences()` to remove ANSI codes from a string
 - Auto-detection of color support via TTY state and `NO_COLOR`, `FORCE_COLOR`, etc.

[0.1.1]: https://github.com/anderson-pete/ansi/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/anderson-pete/ansi/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/anderson-pete/ansi/releases/tag/v0.0.1