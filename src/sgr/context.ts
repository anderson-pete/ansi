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
	};
	context.style = makeStyle(keys ? {...context, keys: allKeys} :  context);

	return context;
}