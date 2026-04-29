"use strict";

/** @type {(r: number, g: number, b: number, code: number) => string} */
function rgb(r, g, b, code) {
	if (r === g && g === b) {
		// Grayscale range.
		if (r >= 232 && r <= 255)
			return `\x1b[${code};5;${r}m`;
	} else if (r >= 0 && r <= 5 && g >= 0 && g <= 5 && b >= 0 && b <= 5) {
		// 6x6x6 color cube.
		const code = 16 + r * 36 + g * 6 + b;
		return `\x1b[${code};5;${code}m`;
	}

	return `\x1b[${code};2;${r};${g};${b}m`;
}

const ansi = {
	reset     : "\x1b[0m",
	underline : "\x1b[4m",
	reverse   : "\x1b[7m",

	fg: {
		black   : "\x1b[30m",
		red     : "\x1b[31m",
		green   : "\x1b[32m",
		yellow  : "\x1b[33m",
		blue    : "\x1b[34m",
		magenta : "\x1b[35m",
		cyan    : "\x1b[36m",
		white   : "\x1b[37m",

		default : "\x1b[39m",

		/** @type {(r: number, g: number, b: number) => string} */
		rgb: (r, g, b) => rgb(r, g, b, 38),
	},

	bg: {
		black   : "\x1b[40m",
		red     : "\x1b[41m",
		green   : "\x1b[42m",
		yellow  : "\x1b[43m",
		blue    : "\x1b[44m",
		magenta : "\x1b[45m",
		cyan    : "\x1b[46m",
		white   : "\x1b[47m",

		default : "\x1b[49m",

		/** @type {(r: number, g: number, b: number) => string} */
		rgb: (r, g, b) => rgb(r, g, b, 48),
	},

	erase: {
		toLineStart : "\x1b[1K",
		toLineEnd   : "\x1b[0K",
		line        : "\x1b[2K",
		screen      : "\x1b[2J",
	},

	caret: {
		hide : "\x1b[?25l",
		show : "\x1b[?25h",

		position: {
			get: "\x1b[6n",
			/** @type {(x: number, y: number) => string} */
			set: (x, y) => `\x1b[${y + 1};${x + 1}H`,
		},

		shape: {
			steadyBlock       : "\x1b[2 q",
			steadyBar         : "\x1b[6 q",
			steadyUnderline   : "\x1b[4 q",
			blinkingBlock     : "\x1b[1 q",
			blinkingBar       : "\x1b[5 q",
			blinkingUnderline : "\x1b[3 q",
			default           : "\x1b[0 q",
		},
	},

	/** @type {(lines: number) => string} */
	scrollUp   : lines => `\x1b[${lines}S`,
	/** @type {(lines: number) => string} */
	scrollDown : lines => `\x1b[${lines}T`,
};

module.exports = ansi;