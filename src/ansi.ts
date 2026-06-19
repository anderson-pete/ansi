import {makeCaret}                       from "./caret";
import {makeErase}                       from "./erase";
import {getFeatures}                     from "./features";
import {padEnd, padStart}                from "./pad";
import {makeScroll}                      from "./scroll";
import {makeColor, makeReset, makeStyle} from "./sgr";
import {simplify}                        from "./simplify";
import {slice}                           from "./slice";
import {sanitize, strip, visibleLength}  from "./strip";
import {makeTerminal}                    from "./terminal";

import type {Args}         from "./features/features";
import type {Caret}        from "./caret";
import type {Erase}        from "./erase";
import type {Features}     from "./features/types";
import type {Scroll}       from "./scroll";
import type {Color, Style} from "./sgr";
import type {Terminal}     from "./terminal";

export type Ansi = Color & {
	caret  : Caret;
	erase  : Erase;
	scroll : Scroll;

	reset : string;
	style : Style;

	terminal : Terminal;

	padEnd   : typeof padEnd;
	padStart : typeof padStart;

	strip         : typeof strip;
	visibleLength : typeof visibleLength;
	sanitize      : typeof sanitize;
	slice         : typeof slice;
	simplify      : typeof simplify;

	features : Features;
};

export function makeAnsi(...args: Args): Ansi {
	const features = getFeatures(...args);

	return {
		caret  : makeCaret(features.caret),
		erase  : makeErase(features.erase),
		scroll : makeScroll(features.scroll),

		reset : makeReset(features.colorDepth > 1),
		style : makeStyle(features.style),
		...makeColor(features.colorDepth),

		terminal: makeTerminal(features.terminal),

		padEnd,
		padStart,

		strip,
		visibleLength,
		sanitize,
		slice,
		simplify,

		features,
	};
}

const ansi = Object.assign(makeAnsi, makeAnsi());

export default ansi;