const {makeSGR}                                       = require("../sgr");
const {makeStyle}                                     = require("../style");
const {clip, rgbToX256, rgbToX16, rgbToX8, x256ToRgb} = require("./utils");

/** @typedef {import("../sgr").Code}                     Code */
/** @typedef {import("../../features/types").ColorDepth} ColorDepth */
/** @typedef {import("../sgr").SGR}                      SGR */
/** @typedef {import("./types").Channel}                 Channel */

const fgOpen = 30, fgClose = 39;
const bgOpen = 40, bgClose = 49;

/** @type {(colorDepth: ColorDepth, open: number, close: number) => Channel} */
function makeChannel(colorDepth, open, close) {
	const sgrBase = makeSGR(colorDepth > 1);
	const style   = makeStyle(colorDepth > 1);

	/** @type {(code: Code) => SGR} */
	const sgr = code => sgrBase(code, close);

	/** @type {(index: number) => SGR} */
	const bright =
		colorDepth >= 4 ? index => sgr(open + 60 + index) :
		colorDepth === 3 ?
			open === fgOpen ?
				index => style.bold.combine(sgr(open + index)) :
				index => sgr(open + index) :
		() => sgr(0);

	/** @type {(code: number) => SGR} */
	const x16ToX8 =
		open === fgOpen ?
			code => code >= 60 ? style.bold.combine(sgr(open + code - 60)) : sgr(open + code) :
			code => code >= 60 ? sgr(open + code - 60) : sgr(open + code);

	return {
		black   : sgr(open + 0),
		red     : sgr(open + 1),
		green   : sgr(open + 2),
		yellow  : sgr(open + 3),
		blue    : sgr(open + 4),
		magenta : sgr(open + 5),
		cyan    : sgr(open + 6),
		white   : sgr(open + 7),

		brightBlack   : bright(0),
		brightRed     : bright(1),
		brightGreen   : bright(2),
		brightYellow  : bright(3),
		brightBlue    : bright(4),
		brightMagenta : bright(5),
		brightCyan    : bright(6),
		brightWhite   : bright(7),

		rgb:
			colorDepth >= 24 ? (r, g, b) => sgr([open + 8, 2, ...clip(r, g, b)]) :
			colorDepth >=  8 ? (r, g, b) => sgr([open + 8, 5, rgbToX256(...clip(r, g, b))]) :
			colorDepth >=  4 ? (r, g, b) => sgr(open + rgbToX16(...clip(r, g, b))) :
			colorDepth === 3 ?
				open === fgOpen ?
					(r, g, b) => x16ToX8(rgbToX16(...clip(r, g, b))) :
					(r, g, b) => sgr(open + rgbToX8(...clip(r, g, b))) :
			() => sgr(0),

		/** @type {(...args: [number] | [number, number, number]) => SGR} */
		x256:
			colorDepth >= 8 ?
				(...args) => sgr(
					[open + 8, 5, args.length === 3 ? rgbToX256(...clip(...args)) : clip(args[0])],
				) :
			colorDepth >= 4 ?
				(...args) => sgr(
					open +
					rgbToX16(...(args.length === 3 ? clip(...args) : x256ToRgb(clip(args[0])))),
				) :
			colorDepth === 3 ?
				open === fgOpen ?
					(...args) => x16ToX8(
						args.length === 3 ?
							rgbToX16(...clip(...args)) :
							rgbToX16(...x256ToRgb(clip(args[0]))),
					) :
					(...args) => sgr(
						open + rgbToX8(
						...args.length === 3 ? clip(...args) : x256ToRgb(clip(args[0])),
						),
					) :
			() => sgr(0),

		default: colorDepth > 1 ? `\x1b[${close}m` : "",
	};
}

/** @type {Partial<Record<ColorDepth, {fg: Channel, bg: Channel}>>} */
const cache = {};

/** @type {(colorDepth: ColorDepth) => {fg: Channel, bg: Channel}} */
const makeColor = (colorDepth = 4) =>
	cache[colorDepth] ?? (cache[colorDepth] = {
		fg : makeChannel(colorDepth, fgOpen, fgClose),
		bg : makeChannel(colorDepth, bgOpen, bgClose),
	});

module.exports = {makeColor};