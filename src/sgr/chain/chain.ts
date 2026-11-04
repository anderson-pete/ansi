import {getContext}            from "../context";
import {ContextTracker}        from "../context-tracker";
import {getFamily}             from "../format";
import {attachChain}           from "./attach";
import {allKeys}               from "./keys";

import type {Features}           from "#features";
import type {FormatContext}      from "../context";
import type {Format, FormatBase} from "../format";
import type {ChainKey}           from "./keys";

function cloneFormat(format: FormatBase, context: FormatContext<any>): FormatBase {
	const family = getFamily(format);
	if (family)
		return family.makeClone(format);

	// Not one of ours, so the clone has to carry what we know about it.
	const {open, close, codes, combine} = format;

	return Object.assign(
		ContextTracker.track((text: string) => format(text), context),
		{open, close, codes, combine},
	);
}

function keysMatch(a: ReadonlySet<ChainKey>, b: ReadonlySet<ChainKey>): boolean {
	if (a.size !== b.size)
		return false;

	for (const key of a)
		if (!b.has(key))
			return false;

	return true;
}

type ChainArgs<Keys extends ChainKey> = [
	keys       : ReadonlySet<Keys>,
	baseFormat : FormatBase,
	features?  : Features,
];

type OverloadedArgs<Keys extends ChainKey> = [FormatBase, Features?] | ChainArgs<Keys>;

const resolveArgs = <Keys extends ChainKey>(args: OverloadedArgs<Keys>): ChainArgs<Keys> =>
	args.length === 1 ?
		[allKeys as ReadonlySet<Keys>, args[0], undefined] :
	args.length === 2 ?
		typeof args[0] === "function"
			? [allKeys as ReadonlySet<Keys>, ...args as [FormatBase]]
			: args as ChainArgs<Keys> :
	args as ChainArgs<Keys>;

export function chain(baseFormat: FormatBase, features?: Features): Format<ChainKey>;
export function chain<Keys extends ChainKey = ChainKey>(...args: ChainArgs<Keys>): Format<Keys>;

export function chain<Keys extends ChainKey>(...args: OverloadedArgs<Keys>): Format<Keys> {
	const [keys, baseFormat, features] = resolveArgs(args);

	let context = getContext(baseFormat, features);
	if (!keysMatch(context.keys, keys))
		context = context.rebuild({keys});

	return attachChain(context, cloneFormat(baseFormat, context));
}

export type AddChain = typeof chain;