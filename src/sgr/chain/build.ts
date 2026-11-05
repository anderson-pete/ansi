import {channels}                   from "../color";
import {makeChannel}                from "../color/channel";
import {makeLazyClass}              from "../lazy-class";
import {makeStyleFormat, styleKeys} from "../style";
import {ChainKeys}                  from "./chain-keys";

import type {Color}                  from "../color";
import type {FormatContext}          from "../context";
import type {FormatBase}             from "../format";
import type {LazyPropertyDefinition} from "../lazy-class";
import type {Style}                  from "../style";
import type {ChainKey}               from "./keys";

export type Chain<Keys extends ChainKey> = Color<Keys> & Style<Keys>;
export type ChainClass                   = new (context: FormatContext<any>) => object;

function makeChainClass(keys: ChainKeys): ChainClass {
	const definitions: LazyPropertyDefinition<FormatContext<any>>[] = [];

	for (const key of styleKeys) {
		if (keys.has(key))
			definitions.push([key, context => makeStyleFormat(context, key)]);
	}

	for (const key of channels) {
		if (keys.has(key))
			definitions.push([key, context => makeChannel(context.removeKey(key), key)]);
	}

	return makeLazyClass(definitions);
}

export function makeChain<Keys extends ChainKey>(
	context    : FormatContext<Keys>,
	baseFormat : FormatBase,
): Chain<Keys> {
	const keys       = ChainKeys.forKeys(context.keys);
	const ChainClass = keys.chainClass ??= makeChainClass(keys);

	return new ChainClass(context.rebuild({parentCodes: baseFormat.codes})) as Chain<Keys>;
}