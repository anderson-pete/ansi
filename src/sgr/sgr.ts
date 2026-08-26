import {Code}              from "#code";
import {allKeys}           from "./chain";
import {makeColor}         from "./color";
import {combineCodes}      from "./combine";
import {makeFormatBuilder} from "./format-builder";
import {makeReset}         from "./reset";
import {makeStyle}         from "./style";

import type {ColorDepth, Features}              from "#features";
import type {Chain, ChainKey}                   from "./chain";
import type {Color}                             from "./color";
import type {Format, FormatBase, FormatBuilder} from "./format-builder";
import type {Style}                             from "./style";

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

	const makeFormat = makeFormatBuilder(makeChain);
	const style      = makeStyle(allKeys, makeFormat, features.style);

	function makeChain<Keys extends ChainKey>(
		keys       : ReadonlySet<Keys>,
		baseFormat : FormatBase,
	): Chain<Keys> {
		const makeChainedFormat: FormatBuilder = (keys, open, close, reset) => makeFormat(
			keys,
			combineCodes(baseFormat.codes.open, open),
			combineCodes(baseFormat.codes.close, close),
			reset,
		);

		return {
			...makeColor(keys, makeChainedFormat, style, features.colorDepth),
			...makeStyle(keys, makeChainedFormat, features.style),
		};
	}

	const rtn: SGR = {
		...makeColor(allKeys, makeFormat, style, features.colorDepth),
		style,
		plain : makeFormat(allKeys, Code.disabled, Code.disabled),
		reset : makeReset(features.colorDepth > 1 || features.style),
	};

	cache[cacheKey] = rtn;

	return rtn;
}