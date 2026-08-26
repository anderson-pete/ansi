import {lazy}      from "../lazy";
import {makeChain} from "./build";

import type {FormatContext}      from "../context";
import type {Format, FormatBase} from "../format";
import type {ChainKey}           from "./keys";

export const attachChain = <Keys extends ChainKey>(
	context    : FormatContext<Keys>,
	baseFormat : FormatBase,
): Format<Keys> => !context.keys.size
	? baseFormat as Format<Keys>
	: lazy.add(baseFormat, "and", () => makeChain(context, baseFormat));