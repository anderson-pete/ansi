import {TypedObject}       from "../typed-object";
import {makeColor}         from "./color";
import {combineCodes}      from "./combine";
import {makeFormatBuilder} from "./format-builder";
import {makeReset}         from "./reset";
import {makeStyle}         from "./style";

import type {ColorDepth, Features}                            from "../features";
import type {Chain, ChainKey, FormatBase, FormatBuilder, SGR} from "./types";

const keyMap: Record<ChainKey, undefined> = {
	fg              : undefined,
	bg              : undefined,
	bold            : undefined,
	dim             : undefined,
	italic          : undefined,
	underline       : undefined,
	inverse         : undefined,
	hidden          : undefined,
	strikethrough   : undefined,
	doubleUnderline : undefined,
	frame           : undefined,
	encircle        : undefined,
	overline        : undefined,
};

const allKeys: ReadonlySet<ChainKey> = new Set(TypedObject.keys(keyMap));

const cache: Partial<Record<`${ColorDepth}.${boolean}`, SGR>> = {};

export function makeSGR(features: Features): SGR {
	const cacheKey = `${features.colorDepth}.${features.style}` as const;
	if (cache[cacheKey])
		return cache[cacheKey];

	const colorFormat = makeFormatBuilder(makeChain, features.colorDepth > 1);
	const styleFormat = makeFormatBuilder(makeChain, features.style);
	const style       = makeStyle(allKeys, styleFormat, features.style);

	function makeChain<Keys extends ChainKey>(
		keys       : ReadonlySet<Keys>,
		baseFormat : FormatBase,
	): Chain<Keys> {
		const chainedColorFormat: FormatBuilder = (keys, open, close, reset) => colorFormat(
			keys,
			combineCodes(baseFormat.codes.open, open),
			combineCodes(baseFormat.codes.close, close),
			reset,
		);
		const chainedStyleFormat: FormatBuilder = (keys, open, close, reset) => styleFormat(
			keys,
			combineCodes(baseFormat.codes.open, open),
			combineCodes(baseFormat.codes.close, close),
			reset,
		);

		return /** @type {Chain<any>} */({
			...makeColor(keys, chainedColorFormat, style, features.colorDepth),
			...makeStyle(keys, chainedStyleFormat, features.style),
		});
	}

	const rtn: SGR = {
		...makeColor(allKeys, colorFormat, style, features.colorDepth),
		style,
		reset: makeReset(features.colorDepth > 1 || features.style),
	};

	cache[cacheKey] = rtn;

	return rtn;
}