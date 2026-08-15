import {makeCursor}                        from "./cursor";
import {makeDelete, makeErase, makeInsert} from "./ins-del";
import {getFeatures}                       from "./features";
import {padEnd, padStart}                  from "./pad";
import {makeScroll}                        from "./scroll";
import {makeSGR}                           from "./sgr";
import {simplify}                          from "./simplify";
import {slice}                             from "./slice";
import {splitAt}                           from "./split-at";
import {sanitize, strip, visibleLength}    from "./strip";
import {makeTerminal}                      from "./terminal";

import type {Args} from "./features";
import type {Ansi} from "./types";

export function makeAnsi(...args: Args): Ansi {
	const features = getFeatures(...args);

	return {
		...makeSGR(features),

		cursor : makeCursor(features.cursor),
		delete : makeDelete(features.erase),
		erase  : makeErase(features.erase),
		insert : makeInsert(features.erase),
		scroll : makeScroll(features.scroll),

		terminal: makeTerminal(features.terminal),

		padEnd,
		padStart,

		strip,
		visibleLength,
		sanitize,
		slice,
		simplify,
		splitAt,

		features,
	};
}

export const ansi     = makeAnsi();
export const disabled = makeAnsi(false);

export const {fg, bg, style, reset, cursor, erase, scroll, terminal} = ansi;

export {padEnd, padStart, splitAt, strip, visibleLength}

export default Object.assign(
	Object.defineProperty(makeAnsi.bind(undefined), "name", {value: "ansi"}),
	ansi,
	{disabled},
);