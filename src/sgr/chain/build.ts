import {makeColor} from "../color";
import {makeStyle} from "../style";

import type {Color}         from "../color";
import type {FormatContext} from "../context";
import type {FormatBase}    from "../format";
import type {Style}         from "../style";
import type {ChainKey}      from "./keys";

export type Chain<Keys extends ChainKey> = Color<Keys> & Style<Keys>;

export function makeChain<Keys extends ChainKey>(
	context    : FormatContext<Keys>,
	baseFormat : FormatBase,
): Chain<Keys> {
	context = context.rebuild({parentCodes: baseFormat.codes});
	return makeColor(context, makeStyle(context));
}