# Changelog

## [3.8.3] - 2026-11-05
### Fixed
 - Since 3.8.0, formats chained using `.and` lost the parent formats and rendered only the final
   format in the chain. This is now fixed.
 - Nested calls to `chain()` could result in an incorrectly determined features, notably color depth

### Changed
 - Huge performance gains. I've taken steps throughout this library's history to make sure it
   performed well for common use cases, but some edge cases remained. In particular, `.rgb()` and
   `.x256()` formats were comparatively slow (~1.5 µs per call), and chaining them with `.and` was
   **much** slower (~38 µs additional per call). Using `.combine()` was faster, but still cost
   about 2.5 µs per call.

   I've put a **lot** of work into optimizing these and other cases, and the results are
   significant. In the following table, `$` represents an `ansi` instance, and the timings are
   approximated averages over multiple runs. Your results may vary.

   | Expression                               |  Before | After  | Speedup |
   | ---------------------------------------- | ------- | ------ | ------- |
   | `$.fg.rgb(…)`                            |  1.5 µs | 145 ns |     10× |
   | `$.fg.x256(0)`                           |  1.4 µs | 120 ns |     12× |
   | `$.fg.rgb(…).combine($.style.bold)`      |  3.9 µs | 435 ns |      9× |
   | `$.fg.rgb(…).and.bold`                   |   39 µs | 735 ns |     53× |
   | `$.fg.rgb(…).and.bold.and.dim.and.frame` |  108 µs | 2.7 µs |     40× |
   | `$.style.bold.combine($.fg.rgb(…))`      |    4 µs | 435 ns |      9× |
   | `$.style.bold.and.fg.rgb(…)`             |  2.2 µs | 200 ns |     11× |
   | `$.fg.red`                               |  8.9 ns | 4.9 ns |    1.8× |
   | `$.fg.red.and.bold`                      | 12.5 ns | 5.5 ns |    2.3× |

   The last two entries demonstrate that simple colors were already very fast, because they could be
   cached, but even those have been further optimized in this release.

   Initial load time of the library has _increased_ slightly, from about 12.5 ms to about 14 ms.
   This is mostly due to refactor of some modules into multiple files and can be mitigated by using
   a bundler.

   A lot of implementation details have changed, and if you were relying on any of it, it may cause
   some issues for you. In particular, you may notice:

    * `.combine` is now a method that needs its `this` context, so you can't destructure it without
      binding it to its source format or calling it with `.call`

    * Many properties and methods are no longer enumerable and won't show up in object dumps. Some
      _will_ show up, but only after first use.

    * You may notice new class names in object dumps.

    * Previously, mutating a set after passing it to `chain()` could change the properties present
      in the immediate `.and` chain. That is no longer possible.

  None of this behavior is documented and relying on it is unsupported. The public API remains
  unchanged (with the exception of `.combine` now being a method instead of a function property).

## [3.8.2] - 2026-10-06
### Fixed
 - Fixed generic exports for CJS consumers

## [3.8.1] - 2026-10-06
###
 - Export `Channel` type from SGR color module

## [3.8.0] - 2026-08-26
### Added
 - `chain` export for arbitrary chaining to a formatter that allows styles already used

## [3.7.1] - 2026-08-19
### Added
 - Export a few helpful SGR types

## [3.7.0] - 2026-08-16
### Added
 - New `scroll.setRegion(top, bottom)` function

### Changed
 - `cursor.x` and `cursor.position.set()` now omit parameters less than `2`, allowing the terminal
   to use its default value of `1`

## [3.6.0] - 2026-08-15
### Changed
 - Relative cursor movement functions, scroll functions, and insert/delete functions can now be
   given negative counts to move or scroll in the opposite direction, or to swap insert/delete
   operations. For example, `ansi.cursor.up(-3)` is equivalent to `ansi.cursor.down(3)`, and
   `ansi.insert.line(-2)` is equivalent to `ansi.delete.line(2)`.

## [3.5.0] - 2026-08-14
### Added
 - add a `disabled` export that returns an `Ansi` instance with all features disabled, useful for
   testing or for disabling output in certain environments

## [3.4.0] - 2026-08-14
### Added
 - `erase.char(count)` - erase characters (default 1)
 - `ansi.insert.char(count)` and `ansi.insert.line(count)` - insert characters or lines (default 1)
 - `ansi.delete.char(count)` and `ansi.delete.line(count)` - delete characters or lines (default 1)

## [3.3.0] - 2026-08-14
### Changed
 - The `visibleIndex` parameter of `splitAt()` can now be negative, just like `slice()`

## [3.2.0] - 2026-08-14
### Added
 - `ansi.splitAt()` can now optionally include SGR code from before and after the split point so
   each slice preserves the terminal state

## [3.1.1] - 2026-08-14
### Changed
 - The `end` parameter of `slice()` is now optional and defaults to the end of the string

## [3.1.0] - 2026-08-14
### Added
 - `ansi.splitAt()` function to split a string into two parts at a given visible index, ignoring
    ANSI sequences

### Fixed
 - Cursor movement functions will no longer emit an invalid sequence containing `?` when given `0`,
   and will instead emit an empty string

### Changed
 - `cursor` and `scroll` functions will now omit the `1` parameter from their output sequences when
   their argument is `1`

## [3.0.0] - 2026-08-14
### Changed
 - Renamed `caret` to `cursor` for consistency with ANSI terminology

## [2.3.1] - 2026-08-05
### Fixed
 - Fixed overzealous simplification for RGB and 256-color codes, which won't render correctly on
   some terminals

## [2.3.0] - 2026-07-07
### Added
 - `ansi.plain()`, an identity formatter that returns its input string unchanged

### Changed
 - `0` codes in SGR functions will now format as empty strings for shorter output
 - `combine()` now uses `simplify()` to remove redundant codes from the output sequence

### Fixed
 - Combining enabled and disabled SGR namespaces now works reliably

## [2.2.0] - 2026-07-06
### Added
 - Brought back the `combine()` method on SGR functions for appending arbitrary styles

## [2.1.1] - 2026-07-02
### Fixed
 - Fixed missing TypeScript type information when `moduleResolution` is `node16` or `nodenext`
 - Fixed `simplify()` function completely mangling its input

### Changed
 - `simplify()` now performs more optimizations involving reset codes and default state detection,
   resulting in shorter output sequences

## [2.1.0] - 2026-07-02
### Added
 - Dual CJS/ESM build: the package now ships both a CJS entry (`dist/cjs`) and an ESM entry
   (`dist/esm`) with identical APIs
 - `makeAnsi` is now exported as a named export for TypeScript and ESM consumers
 - `Ansi` type is now exported

### Changed
 - The named `ansi` export is now a plain object, and no longer an alias for the `makeAnsi()`
   function. Both the `makeAnsi` export and the default export remain callable functions, and the
   default export also has the `ansi` object properties attached to it for backward compatibility.

### Fixed
 - Default export is now directly callable again via `require()`, restoring the original CJS
   consumer behavior from before the TypeScript conversion

## [2.0.1] - 2026-07-01
### Fixed
 - Fixed a bug where `ansi(number)` would ignore the requested color depth and use auto detection on
   `stdout` or the given stream instead

## [2.0.0] - 2026-07-01
### Changed
- Replaced `.combine()` method with fluent `.and` property for chaining SGR styles
- `and` chains unnest the `style` namespace, allowing `.and.bold` instead of `.and.style.bold`
- Rewrote SGR module with new type structure (`Format` conditional type replacing `SGR`)
- Added dependencies: `TypedObject`, `@peteanderson/props`

### Added
- Fluent interface for natural style chaining: `ansi.fg.white.and.bg.blue.and.bold("text")`

## [1.0.1] - 2026-06-25
### Fixed
 - `combine()` no longer outputs `22;22` when combining `bold` and `dim`

## [1.0.0] - 2026-06-19
### Changed
 - Converted to TypeScript

## [0.3.3] - 2026-06-15
### Fixed
 - Passing `undefined` to style functions now returns an empty string instead of throwing an error

## [0.3.2] - 2026-05-31
### Added
- Focus reporting: terminal sends sequences when gaining/losing focus
- Alternate screen buffer mode with modern and legacy sequence support
- Bracketed paste mode: distinguishes pasted text from typed input

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

[3.8.3]: https://github.com/anderson-pete/ansi/compare/v3.8.2...v3.8.3
[3.8.2]: https://github.com/anderson-pete/ansi/compare/v3.8.1...v3.8.2
[3.8.1]: https://github.com/anderson-pete/ansi/compare/v3.8.0...v3.8.1
[3.8.0]: https://github.com/anderson-pete/ansi/compare/v3.7.1...v3.8.0
[3.7.1]: https://github.com/anderson-pete/ansi/compare/v3.7.0...v3.7.1
[3.7.0]: https://github.com/anderson-pete/ansi/compare/v3.6.0...v3.7.0
[3.6.0]: https://github.com/anderson-pete/ansi/compare/v3.5.0...v3.6.0
[3.5.0]: https://github.com/anderson-pete/ansi/compare/v3.4.0...v3.5.0
[3.4.0]: https://github.com/anderson-pete/ansi/compare/v3.3.0...v3.4.0
[3.3.0]: https://github.com/anderson-pete/ansi/compare/v3.2.0...v3.3.0
[3.2.0]: https://github.com/anderson-pete/ansi/compare/v3.1.1...v3.2.0
[3.1.1]: https://github.com/anderson-pete/ansi/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/anderson-pete/ansi/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/anderson-pete/ansi/compare/v2.3.1...v3.0.0
[2.3.1]: https://github.com/anderson-pete/ansi/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/anderson-pete/ansi/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/anderson-pete/ansi/compare/v2.1.1...v2.2.0
[2.1.1]: https://github.com/anderson-pete/ansi/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/anderson-pete/ansi/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/anderson-pete/ansi/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/anderson-pete/ansi/compare/v1.0.1...v2.0.0
[1.0.1]: https://github.com/anderson-pete/ansi/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/anderson-pete/ansi/compare/v0.3.3...v1.0.0
[0.3.3]: https://github.com/anderson-pete/ansi/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/anderson-pete/ansi/compare/v0.3.1...v0.3.2
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