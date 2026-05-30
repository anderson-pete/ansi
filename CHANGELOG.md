# Changelog

## [0.3.1] - 2026-05-30
### Added
 - `padEnd()` and `padStart()` functions for padding strings to a specified visible length, ignoring
    ANSI sequences

## [0.3.0] - 2026-05-30
### Added
- Automatic feature detection for terminal capabilities (color depth, style, caret, erase, scroll)
- Color downscaling for terminals with limited color support (3-bit, 4-bit, 8-bit)
- Configurable feature overrides via default export function with multiple override formats:
  boolean, number, stream, or partial feature config
- Support for manual stream selection and per-feature toggles

### Changed
- Default export is now a function for feature configuration (maintains backward compatibility via
  properties)
- SGR `$codes` property changed from symbol to regular property

## [0.2.3] - 2026-05-29
### Added
- `visibleLength()` function to get string length with ANSI sequences removed

### Changed
- `slice()` now simplifies SGR sequences at boundaries to maintain correct terminal state, instead
  of blindly appending a reset

### Fixed
- SGR pattern now correctly matches all valid SGR sequences, including those with omitted codes
  (e.g., `\x1b[m`, `\x1b[1;m`)

## [0.2.2] - 2026-05-15
### Added
 - `simplify()` function to remove redundant SGR codes from a string

## [0.2.1] - 2026-05-15
### Added
- `[$codes]` property on SGR functions to access original codes
- `combine()` method on SGR functions for appending additional styles
- `x256()` overload to accept a single 256-color code instead of RGB components

### Changed
- Reorganized `sgr` module into multiple files in `sgr/` directory
- SGR functions now accept `number | number[]` instead of `number | string`

### Fixed
- Dim and bold styles now properly handle nesting within each other

## [0.2.0] - 2026-05-15
### Removed
 - Capability detection (`colorDepth` and `enabled`). This implementation was incomplete. I'll add
   a more robust version in a future release.

## [0.1.2] - 2026-04-29
### Added
 - `colorDepth` and `enabled` properties with separate `stdout` and `stderr` detection
 - Caret movement: `up()`, `down()`, `forward()`, `backward()`, `nextLine()`, `prevLine()`, and
   `x()` for absolute positioning
 - VT100 `save` and `restore` caret sequences
 - Extended color support: 4-bit bright colors and `x256` for 8-bit colors
 - Expanded style options: `bold`, `dim`, `italic`, `hidden`, `strikethrough`, `doubleUnderline`,
   `framed`, `encircled`, `overline`
 - `sanitize()` function to remove unsafe CSI sequences
 - SGR features (`fg`, `bg`, `style`) now include `open` and `close` properties

### Changed
 - Reorganized into feature-based modules (`sgr`, `strip`, `scroll`, etc.)
 - SGR features are now callable functions that wrap text, restoring `color.js` behavior
 - `scroll.up()` and `scroll.down()` replace `scrollUp` and `scrollDown`
 - `erase` now uses nested objects: `erase.line` and `erase.screen` with `toStart`, `toEnd`, and
   `full` properties
 - Caret `position.set()` now uses 1-based indexing consistently

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

[0.3.1]: https://github.com/anderson-pete/ansi/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/anderson-pete/ansi/compare/v0.2.3...v0.3.0
[0.2.3]: https://github.com/anderson-pete/ansi/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/anderson-pete/ansi/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/anderson-pete/ansi/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/anderson-pete/ansi/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/anderson-pete/ansi/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/anderson-pete/ansi/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/anderson-pete/ansi/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/anderson-pete/ansi/releases/tag/v0.0.1