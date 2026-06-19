import {makeSGR}                                       from "../sgr";
import {makeStyle}                                     from "../style";
import {clip, rgbToX16, rgbToX256, rgbToX8, x256ToRgb} from "./utils";

import type {ColorDepth}     from "../../features/types";
import type {SGR}            from "../sgr";
import type {Channel, Color} from "./types";

export type {Color} from "./types";

const fgOpen = 30, fgClose = 39;
const bgOpen = 40, bgClose = 49;

function makeChannel(colorDepth: ColorDepth, open: number, close: number): Channel {
	const sgrBase = makeSGR(colorDepth > 1);
	const style   = makeStyle(colorDepth > 1);

	const sgr = (code: number | number[]): SGR => sgrBase(code, close);

	const bright: (index: number) => SGR =
		colorDepth >= 4 ? index => sgr(open + 60 + index) :
		colorDepth === 3 ?
			open === fgOpen ?
				index => style.bold.combine(sgr(open + index)) :
				index => sgr(open + index) :
		() => sgr(0);

	const x16ToX8: (code: number) => SGR =
		open === fgOpen ?
			code => code >= 60 ? style.bold.combine(sgr(open + code - 60)) : sgr(open + code) :
			code => code >= 60 ? sgr(open + code - 60)                     : sgr(open + code);

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

		x256:
			colorDepth >= 8 ?
				(...args: [number] | [number, number, number]): SGR => sgr(
					[open + 8, 5, args.length === 3 ? rgbToX256(...clip(...args)) : clip(args[0])],
				) :
			colorDepth >= 4 ?
				(...args: [number] | [number, number, number]): SGR => sgr(
					open +
					rgbToX16(...(args.length === 3 ? clip(...args) : x256ToRgb(clip(args[0])))),
				) :
			colorDepth === 3 ?
				open === fgOpen ?
					(...args: [number] | [number, number, number]): SGR => x16ToX8(
						args.length === 3
							? rgbToX16(...clip(...args))
							: rgbToX16(...x256ToRgb(clip(args[0]))),
					) :
					(...args: [number] | [number, number, number]): SGR => sgr(
						open +
						rgbToX8(...args.length === 3 ? clip(...args) : x256ToRgb(clip(args[0]))),
					) :
			(): SGR => sgr(0),

		default: colorDepth > 1 ? `\x1b[${close}m` : "",
	};
}

const cache: Partial<Record<ColorDepth, Color>> = {};

export const makeColor = (colorDepth: ColorDepth = 4): Color =>
	cache[colorDepth] ?? (cache[colorDepth] = {
		fg : makeChannel(colorDepth, fgOpen, fgClose),
		bg : makeChannel(colorDepth, bgOpen, bgClose),
	});