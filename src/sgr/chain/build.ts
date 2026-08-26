import {makeColor}    from "../color";
import {combineCodes} from "../combine";
import {makeStyle}    from "../style";

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
	const parentCodes = context.parentCodes ? {
		open  : combineCodes(context.parentCodes.open, baseFormat.codes.open),
		close : combineCodes(baseFormat.codes.close, context.parentCodes.close),
	} : baseFormat.codes;

	const chainedContext: FormatContext<Keys> = {...context, parentCodes};

	return {...makeColor(chainedContext), ...makeStyle(chainedContext)};
}