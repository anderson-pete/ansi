import {makeColor}    from "../color";
import {combineCodes} from "../combine";
import {lazy}         from "../lazy";
import {makeStyle}    from "../style";

import type {Color}              from "../color";
import type {FormatContext}      from "../context";
import type {Format, FormatBase} from "../format-builder";
import type {Style}              from "../style";
import type {ChainKey}           from "./keys";

export type Chain<Keys extends ChainKey> = Color<Keys> & Style<Keys>;

function makeChain<Keys extends ChainKey>(
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

export const attachChain = <Keys extends ChainKey>(
	context    : FormatContext<Keys>,
	baseFormat : FormatBase,
): Format<Keys> => !context.keys.size
	? baseFormat as Format<Keys>
	: lazy.add(baseFormat, "and", () => makeChain(context, baseFormat));