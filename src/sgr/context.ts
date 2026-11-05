import {getFeatures}        from "#features";
import {allKeys, ChainKeys} from "./chain";
import {ContextTracker}     from "./context-tracker";
import {getFamily}          from "./format";
import {makeStyle}          from "./style";

import type {Codes}      from "#code";
import type {Features}   from "#features";
import type {ChainKey}   from "./chain";
import type {FormatBase} from "./format";
import type {Style}      from "./style";

export interface FormatContext<Keys extends ChainKey = ChainKey> {
	features     : Features;
	keys         : ChainKeys<Keys>;
	parentCodes? : Codes;
	style        : Style;

	rebuild<K2 extends ChainKey = Keys>(
		newProps: {parentCodes?: Codes, keys?: ChainKeys<K2>}
	): FormatContext<K2>;

	removeKey<Key extends Keys>(key: Key): FormatContext<Exclude<Keys, Key>>;
}

function rebuild<K1 extends ChainKey, K2 extends ChainKey = K1>(
	this     : FormatContext<K1>,
	newProps : {parentCodes?: Codes, keys?: ChainKeys<K2>}
): FormatContext<K2> {
	return {...this, ...newProps} as FormatContext<K2>;
}

function removeKey<Keys extends ChainKey, Key extends Keys>(
	this : FormatContext<Keys>,
	key  : Key,
): FormatContext<Exclude<Keys, Key>> {
	const keys = ChainKeys.forKeys(this.keys).withoutKey(key);
	return this.rebuild({keys}) as FormatContext<Exclude<Keys, Key>>;
}

export function getContext(format: FormatBase, features?: Features): FormatContext<any> {
	let context = getFamily(format)?.context ?? ContextTracker.find(format);
	if (context)
		return context;

	features ??= getFeatures(format.open ? 24 : 1);

	context = {
		features,
		keys        : allKeys,
		parentCodes : format.codes,
		style       : undefined as unknown as Style,
		rebuild,
		removeKey,
	};
	context.style = makeStyle(context);

	ContextTracker.track(format, context);
	return context;
}

export function createContext<Keys extends ChainKey = ChainKey>(
	features     : Features,
	parentCodes? : Codes,
	keys?        : ChainKeys<Keys>,
): FormatContext<Keys> {
	const context: FormatContext<Keys> = {
		features,
		keys        : keys ?? allKeys as ChainKeys<Keys>,
		parentCodes,
		style       : undefined as unknown as Style,
		rebuild,
		removeKey,
	};
	context.style = makeStyle(keys ? {...context, keys: allKeys} : context);

	return context;
}