import {allKeys}   from "./chain";
import {makeStyle} from "./style";

import type {Codes}    from "#code";
import type {Features} from "#features";
import type {ChainKey} from "./chain";
import type {Style}    from "./style";

export interface FormatContext<Keys extends ChainKey = ChainKey> {
	features     : Features;
	keys         : ReadonlySet<Keys>;
	parentCodes? : Codes;
	style        : Style;
	removeKey    : <Key extends Keys>(key: Key) => FormatContext<Exclude<Keys, Key>>;
}

export function createContext<Keys extends ChainKey = ChainKey>(
	features     : Features,
	parentCodes? : Codes,
	keys?        : ReadonlySet<Keys>,
): FormatContext<Keys> {
	const context: FormatContext<Keys> = {
		features,
		keys        : keys ?? allKeys as ReadonlySet<Keys>,
		parentCodes,
		style       : undefined as unknown as Style,
		removeKey   : undefined as unknown as FormatContext<Keys>["removeKey"],
	};
	context.style     = makeStyle(keys ? {...context, keys: allKeys} : context);
	context.removeKey = key => {
		const keys = new Set(context.keys);
		keys.delete(key);
		return {...context, keys: keys as unknown as ReadonlySet<Exclude<Keys, typeof key>>};
	};

	return context;
}