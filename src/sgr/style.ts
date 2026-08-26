import {Code}        from "#code";
import {TypedObject} from "#typed-object";
import {lazy}        from "./lazy";

import type {ChainKey}              from "./chain";
import type {Format, FormatBuilder} from "./format-builder";

type FormatBuilderArgs = [Code, Code, boolean?];

const propParamsObj = {
	bold            : [ 1, 22, true],
	dim             : [ 2, 22, true],
	italic          : [ 3, 23],
	underline       : [ 4, 24],
	inverse         : [ 7, 27],
	hidden          : [ 8, 28],
	strikethrough   : [ 9, 29],
	doubleUnderline : [21, 24],
	frame           : [51, 54],
	encircle        : [52, 54],
	overline        : [53, 55],
} satisfies Record<string, FormatBuilderArgs>;

export const styleKeys = TypedObject.keys(propParamsObj);

export type StyleKey = typeof styleKeys[number];

export type Style<Keys extends ChainKey = ChainKey> = {
	[K in Extract<StyleKey, Keys>]: Format<Exclude<Keys, K>>;
};

const propParams = Object.entries(propParamsObj) as ReadonlyArray<[StyleKey, FormatBuilderArgs]>;

const disabledParams: typeof propParams =
	propParams.map(([key]) => [key, [Code.disabled, Code.disabled]]);

export function makeStyle(
	keys          : ReadonlySet<ChainKey>,
	makeFormatter : FormatBuilder,
	enabled       : boolean,
): Style<any> {
	const rtn = {} as Style<any>;

	for (const [key, args] of enabled ? propParams : disabledParams) {
		if (keys.has(key)) {
			lazy.add(rtn, key, () => {
				const newKeys = new Set(keys);
				newKeys.delete(key);
				return makeFormatter(newKeys, ...args)
			});
		}
	}

	return rtn;
}