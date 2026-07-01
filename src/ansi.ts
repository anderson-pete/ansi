import {makeCaret}                       from "./caret";
import {makeErase}                       from "./erase";
import {getFeatures}                     from "./features";
import {padEnd, padStart}                from "./pad";
import {makeScroll}                      from "./scroll";
import {makeSGR}                         from "./sgr";
import {simplify}                        from "./simplify";
import {slice}                           from "./slice";
import {sanitize, strip, visibleLength}  from "./strip";
import {makeTerminal}                    from "./terminal";

import type {Args} from "./features";
import type {Ansi} from "./types";

function makeAnsi(...args: Args): Ansi {
	const features = getFeatures(...args);

	return {
		...makeSGR(features),

		caret  : makeCaret(features.caret),
		erase  : makeErase(features.erase),
		scroll : makeScroll(features.scroll),

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

export const ansi = Object.assign(makeAnsi, makeAnsi());

export const {fg, bg, style, reset, caret, erase, scroll, terminal} = ansi;

export {padEnd, padStart, strip, visibleLength}

export default ansi;