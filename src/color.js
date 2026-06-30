/**
 * @param   {string | undefined} value
 * @returns {boolean}
 */
const isSet = value => !!value && value !== '0' && value.toLowerCase() !== "false";

const enabled =
	isSet(process.env.FORCE_COLOR) ||
		!isSet(process.env.NODE_DISABLE_COLORS) &&
		!isSet(process.env.NO_COLOR) &&
		process.env.TERM !== "dumb" &&
		process.stdout.isTTY;

/**
 * @param   {number | string} open
 * @param   {number | string} close
 * @returns {(text: string) => string}
 */
function ansi(open, close) {
	if (!enabled)
		return s => s;

	const openSequence  = `\x1b[${open}m`;
	const closeSequence = `\x1b[${close}m`;

	return s =>
		openSequence +
		s.replaceAll(openSequence, '').replaceAll(closeSequence, openSequence) +
		closeSequence;
}

/** @param {string} text */
const stripAnsiSequences = text => text.replace(/\x1b\[\d+m/g, '');

/** @type {(r: number, g: number, b: number, open: number, close: number) => (text: string) => string} */
function rgb(r, g, b, open, close) {
	if (r === g && g === b) {
		// Grayscale range.
		if (r >= 232 && r <= 255)
			return ansi(`${open};5;${r}`, close);
	} else if (r >= 0 && r <= 5 && g >= 0 && g <= 5 && b >= 0 && b <= 5) {
		// 6x6x6 color cube.
		const code = 16 + r * 36 + g * 6 + b;
		return ansi(`${open};5;${code}`, close);
	}

	return ansi(`${open};2;${r};${g};${b}`, close);
}

const style = {
	bold          : ansi(1, 22),
	dim           : ansi(2, 22),
	italic        : ansi(3, 23),
	underline     : ansi(4, 24),
	inverse       : ansi(7, 27),
	hidden        : ansi(8, 28),
	strikethrough : ansi(9, 29),
};

// export type Style = keyof typeof style;

const fg = {
	black   : ansi(30, 39),
	red     : ansi(31, 39),
	green   : ansi(32, 39),
	yellow  : ansi(33, 39),
	blue    : ansi(34, 39),
	magenta : ansi(35, 39),
	cyan    : ansi(36, 39),
	white   : ansi(37, 39),
	gray    : ansi(90, 39),

	/** @type {(r: number, g: number, b: number) => (text: string) => string} */
	rgb: (r, g, b) => rgb(r, g, b, 38, 39),
};

// export type Color = keyof typeof fg;

const bg = {
	black   : ansi(40, 49),
	red     : ansi(41, 49),
	green   : ansi(42, 49),
	yellow  : ansi(43, 49),
	blue    : ansi(44, 49),
	magenta : ansi(45, 49),
	cyan    : ansi(46, 49),
	white   : ansi(47, 49),

	/** @type {(r: number, g: number, b: number) => (text: string) => string} */
	rgb: (r, g, b) => rgb(r, g, b, 48, 49),
};

const reset = "\x1b[0m";

module.exports = {
	stripAnsiSequences,
	style,
	fg,
	bg,
	reset,
};