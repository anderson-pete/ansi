import {Code}              from "#code";
import {TypedObject}       from "#typed-object";
import {makeFormat}        from "./format";
import {lazy}              from "./lazy";

import type {ChainKey}      from "./chain";
import type {FormatContext} from "./context";
import type {Format}        from "./format";

type FormatBuilderArgs = [Code, Code, boolean?];

const propParams = {
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

export const styleKeys = TypedObject.keys(propParams);

export type StyleKey = typeof styleKeys[number];

export type Style<Keys extends ChainKey = ChainKey> = {
	[K in Extract<StyleKey, Keys>]: Format<Exclude<Keys, K>>;
};

const disabledParams = Object.fromEntries(
	styleKeys.map(key => [key, [Code.disabled, Code.disabled]]),
) as unknown as Record<StyleKey, FormatBuilderArgs>;

export const makeStyleFormat = <Keys extends ChainKey>(
	context : FormatContext<Keys>,
	key     : StyleKey,
): Format<Exclude<Keys, StyleKey>> => makeFormat(
	context.removeKey(key as Keys),
	...(context.features.style ? propParams : disabledParams)[key],
) as Format<Exclude<Keys, StyleKey>>;

export function makeStyle<Keys extends ChainKey, T extends object = object>(
	context : FormatContext<Keys>,
	obj?    : T,
): T & Style<Keys> {
	const rtn = (obj ?? {}) as T & Style<Keys>;

	for (const key of styleKeys) {
		if (context.keys.has(key as Keys))
			lazy.add(rtn, key, () => makeStyleFormat(context, key));
	}

	return rtn;
}