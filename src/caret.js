"use strict";

/** @type {(code: string) => (count?: number) => string} */
const move = code =>
	count => `\x1b[${count === undefined ? "" : count ? count : "?"}${code}`;

const caret = {
	up       : move("A"),
	down     : move("B"),
	forward  : move("C"),
	backward : move("D"),
	nextLine : move("E"),
	prevLine : move("F"),

	/** @type {(x: number) => string} */
	x: x => `\x1b[${x}G`,

	// These are the old VT100 codes, but they're widely supported by old and new terminals. The
	// newer VT220 codes are standardized by ECMA and ISO, and are also widely supported, but might
	// not work in some older terminals. The VT220 codes are:
	//
	// ```
	// save    : "\x1b[s",
	// restore : "\x1b[u",
	// ```
	save    : "\x1b7",
	restore : "\x1b8",

	hide : "\x1b[?25l",
	show : "\x1b[?25h",

	position: {
		get: "\x1b[6n",
		/** @type {(x: number, y: number) => string} */
		set: (x, y) => `\x1b[${y};${x}H`,
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
};

module.exports = caret;