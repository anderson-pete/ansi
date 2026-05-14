"use strict";

const {sgr} = require("./sgr");

/** @type {(r: number, g: number, b: number, open: number, close: number) => (text: string) => string} */
const rgb = (r, g, b, open, close) => sgr([open, 2, r, g, b], close);

/**
 * @overload
 * @param {number} code
 * @param {number} open
 * @param {number} close
 * @returns {(text: string) => string}
 *//**
 * @overload
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} open
 * @param {number} close
 * @returns {(text: string) => string}
 *//**
@type {
	(
		...args: [number, number, number] | [number, number, number, number, number]
	) => (text: string) => string}
*/
function x256(...args) {
	if (args.length === 3)
		return sgr([args[1], 5, args[0]], args[2]);

	const [r, g, b, open, close] = args;
	if (r === g && g === b) {
		// grayscale
		return sgr([open, 5, 232 + Math.floor(r * 24 / 256)], close);
	}

	// 6x6x6 color cube
	return sgr(
		[
			open,
			5,
			16 +
				Math.floor(r * 6 / 256) * 36 +
				Math.floor(g * 6 / 256) * 6 +
				Math.floor(b * 6 / 256)
		],
		close,
	);
}

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

	/**
	 * @overload
	 * @param {number} code
	 * @returns {(text: string) => string}
	 *//**
	 * @param {number} r
	 * @param {number} g
	 * @param {number} b
	 * @returns {(text: string) => string}
	 *//** @type {(arg0: number, arg1?: number, arg2?: number) => (text: string) => string} */
	x256 : (arg0, arg1, arg2) => arg1 === undefined || arg2 === undefined
		? x256(arg0 , 38, 39)
		: x256(arg0, arg1, arg2, 38, 39),
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

	/**
	 * @overload
	 * @param {number} code
	 * @returns {(text: string) => string}
	 *//**
	 * @param {number} r
	 * @param {number} g
	 * @param {number} b
	 * @returns {(text: string) => string}
	 *//** @type {(arg0: number, arg1?: number, arg2?: number) => (text: string) => string} */
	x256 : (arg0, arg1, arg2) => arg1 === undefined || arg2 === undefined
		? x256(arg0 , 48, 49)
		: x256(arg0, arg1, arg2, 48, 49),
};

module.exports = {fg, bg};