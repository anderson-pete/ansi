"use strict";

/**
 * @param {number | string} open
 * @param {number | string} close
 */
function sgr(open, close) {
	const openSequence  = `\x1b[${open}m`;
	const closeSequence = `\x1b[${close}m`;

	return Object.assign(
		/** @type {(text: string) => string} */
		s =>
			openSequence +
			s.replaceAll(openSequence, '').replaceAll(closeSequence, openSequence) +
			closeSequence,
		{open: openSequence, close: closeSequence}
	);
}

/** @type {(r: number, g: number, b: number, open: number, close: number) => (text: string) => string} */
const rgb = (r, g, b, open, close) => sgr(`${open};2;${r};${g};${b}`, close);

/** @type {(r: number, g: number, b: number, open: number, close: number) => (text: string) => string} */
function x256(r, g, b, open, close) {
	if (r === g && g === b) {
		// grayscale
		return sgr(`${open};5;${232 + Math.floor(r * 24 / 256)}`, close);
	}

	// 6x6x6 color cube
	return sgr(
		`${open};5;${
			16 +
			Math.floor(r * 6 / 256) * 36 +
			Math.floor(g * 6 / 256) * 6 +
			Math.floor(b * 6 / 256)
		}`,
		close,
	);
}

const reset = "\x1b[0m";

const style = {
	bold            : sgr(1, 22),
	dim             : sgr(2, 22),
	italic          : sgr(3, 23),
	underline       : sgr(4, 24),
	inverse         : sgr(7, 27),
	hidden          : sgr(8, 28),
	strikethrough   : sgr(9, 29),
	doubleUnderline : sgr(21, 24),
	frame           : sgr(51, 54),
	encircle        : sgr(52, 54),
	overline        : sgr(53, 55),
};

const fg = {
	black   : sgr(30, 39),
	red     : sgr(31, 39),
	green   : sgr(32, 39),
	yellow  : sgr(33, 39),
	blue    : sgr(34, 39),
	magenta : sgr(35, 39),
	cyan    : sgr(36, 39),
	white   : sgr(37, 39),

	brightBlack   : sgr(90, 39),
	brightRed     : sgr(91, 39),
	brightGreen   : sgr(92, 39),
	brightYellow  : sgr(93, 39),
	brightBlue    : sgr(94, 39),
	brightMagenta : sgr(95, 39),
	brightCyan    : sgr(96, 39),
	brightWhite   : sgr(97, 39),

	default : "\x1b[39m",

	/** @type {(r: number, g: number, b: number) => (text: string) => string} */
	rgb  : (r, g, b) => rgb(r, g, b, 38, 39),
	/** @type {(r: number, g: number, b: number) => (text: string) => string} */
	x256 : (r, g, b) => x256(r, g, b, 38, 39),
};

const bg = {
	black   : sgr(40, 49),
	red     : sgr(41, 49),
	green   : sgr(42, 49),
	yellow  : sgr(43, 49),
	blue    : sgr(44, 49),
	magenta : sgr(45, 49),
	cyan    : sgr(46, 49),
	white   : sgr(47, 49),

	brightBlack   : sgr(100, 49),
	brightRed     : sgr(101, 49),
	brightGreen   : sgr(102, 49),
	brightYellow  : sgr(103, 49),
	brightBlue    : sgr(104, 49),
	brightMagenta : sgr(105, 49),
	brightCyan    : sgr(106, 49),
	brightWhite   : sgr(107, 49),

	default : "\x1b[49m",

	/** @type {(r: number, g: number, b: number) => (text: string) => string} */
	rgb  : (r, g, b) => rgb(r, g, b, 48, 49),
	/** @type {(r: number, g: number, b: number) => (text: string) => string} */
	x256 : (r, g, b) => x256(r, g, b, 48, 49),
};

module.exports = {reset, style, fg, bg};