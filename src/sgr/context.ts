import {getFeatures} from "#features";
import {allKeys}     from "./chain";
import {makeStyle}   from "./style";

import type {Codes}      from "#code";
import type {Features}   from "#features";
import type {ChainKey}   from "./chain";
import type {FormatBase} from "./format";
import type {Style}      from "./style";

export interface FormatContext<Keys extends ChainKey = ChainKey> {
	features       : Features;
	keys           : ReadonlySet<Keys>;
	parentCodes?   : Codes;
	style          : Style;
	removeKey      : <Key extends Keys>(key: Key) => FormatContext<Exclude<Keys, Key>>;
	registerFormat : (format: FormatBase) => void;
}

function removeKey<Keys extends ChainKey, Key extends Keys>(
	context : FormatContext<Keys>,
	key     : Key,
): FormatContext<Exclude<Keys, Key>> {
	const keys = new Set(context.keys);
	keys.delete(key);
	return {...context, keys: keys as unknown as ReadonlySet<Exclude<Keys, Key>>};
}

const cache = new WeakMap<FormatBase, FormatContext<any>>();

export function getContext(format: FormatBase, features?: Features): FormatContext<any> {
	let context = cache.get(format);
	if (context)
		return context;

	features ??= getFeatures(format.open ? 24 : 1);

	context = {
		features,
		keys           : allKeys,
		parentCodes    : format.codes,
		style          : undefined as unknown as Style,
		removeKey      : key => removeKey(context!, key),
		registerFormat : (format: FormatBase) => void cache.set(format, context!),
	};
	context.style = makeStyle(context);

	cache.set(format, context);
	return context;
}

export function createContext<Keys extends ChainKey = ChainKey>(
	features     : Features,
	parentCodes? : Codes,
	keys?        : ReadonlySet<Keys>,
): FormatContext<Keys> {
	const context: FormatContext<Keys> = {
		features,
		keys           : keys ?? allKeys as ReadonlySet<Keys>,
		parentCodes,
		style          : undefined as unknown as Style,
		removeKey      : key => removeKey(context, key),
		registerFormat : format => void cache.set(format, context),
	};
	context.style = makeStyle(keys ? {...context, keys: allKeys} : context);

	return context;
}