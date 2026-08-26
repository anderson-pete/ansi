import {Code}              from "#code";
import {TypedObject}       from "#typed-object";
import {makeFormat}        from "./format-builder";
import {lazy}              from "./lazy";

import type {ChainKey}      from "./chain";
import type {FormatContext} from "./context";
import type {Format}        from "./format-builder";

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

export function makeStyle<Keys extends ChainKey>(context: FormatContext<Keys>): Style<Keys> {
	const rtn = {} as Style<Keys>;

	for (const [key, args] of context.features.style ? propParams : disabledParams) {
		if (context.keys.has(key as Keys)) {
			lazy.add(rtn, key, () => {
				const keys = new Set(context.keys);
				keys.delete(key as Keys);
				const newContext: FormatContext<Keys> = {...context, keys};
				return makeFormat(newContext, ...args)
			});
		}
	}

	return rtn;
}