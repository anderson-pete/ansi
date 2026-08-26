import {Code}          from "#code";
import {makeColor}     from "./color";
import {createContext} from "./context";
import {makeFormat}    from "./format";
import {makeReset}     from "./reset";

import type {ColorDepth, Features} from "#features";
import type {ChainKey}             from "./chain";
import type {Color}                from "./color";
import type {Format}               from "./format";
import type {Style}                from "./style";

export interface SGR extends Color<ChainKey> {
	style : Style;
	plain : Format<ChainKey>;
	reset : string;
}

const cache: Partial<Record<`${ColorDepth}.${boolean}`, SGR>> = {};

export function makeSGR(features: Features): SGR {
	const cacheKey = `${features.colorDepth}.${features.style}` as const;
	if (cache[cacheKey])
		return cache[cacheKey];

	const context = createContext(features);

	const rtn: SGR = {
		...makeColor(context),
		style : context.style,
		plain : makeFormat(context, Code.disabled, Code.disabled),
		reset : makeReset(features.colorDepth > 1 || features.style),
	};

	cache[cacheKey] = rtn;

	return rtn;
}