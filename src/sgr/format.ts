import {Code}              from "#code";
import {codeSequence, csi} from "#utils";
import {attachChain}       from "./chain";
import {combineCodes}      from "./combine";
import {ContextTracker}    from "./context-tracker";

import type {Codes}           from "#code";
import type {Chain, ChainKey} from "./chain";
import type {FormatContext}   from "./context";

export interface FormatBase {
	(text: string): string;

	open    : string;
	close   : string;
	codes   : Codes;
	combine : (...formats: [FormatBase, ...FormatBase[]]) => FormatBase;
}

export interface ChainedFormat<Keys extends ChainKey = ChainKey> extends FormatBase {
	and: Chain<Keys>;
}

export type Format<Keys extends ChainKey = ChainKey> =
	[Keys] extends [never] ? FormatBase : ChainedFormat<Keys>;

export function makeFormat<Keys extends ChainKey = ChainKey>(
	context : FormatContext<Keys>,
	open    : Code,
	close   : Code,
	reset?  : boolean,
): Format<Keys> {
	if (context.parentCodes) {
		open  = combineCodes(context.parentCodes.open, open);
		close = combineCodes(close, context.parentCodes.close);
	}

	const openCode      = codeSequence(open);
	const closeCode     = codeSequence(close);
	const openSequence  = csi(open, "m");
	const closeSequence = csi(close, "m");
	const reopenCode    = reset ? `${closeCode};${openCode}` : openCode;

	const rxClose = new RegExp(
		`(?<start>\\x1b\\[(?:\\d+;)*)${closeCode}(?<end>(?:;\\d+)*m)`,
		"g"
	);
	const replace = `$<start>${reopenCode}$<end>`;

	return attachChain(context, Object.assign(
		ContextTracker.track(
			openSequence
				? (s: string) => s ? openSequence + s.replace(rxClose, replace) + closeSequence : s
				: (s: string) => s,
			context,
		), {
			open    : openSequence,
			close   : closeSequence,
			codes   : {open, close},
			combine : (...formats: [FormatBase, ...FormatBase[]]) => makeFormat(
				context,
				combineCodes(open,  ...formats.map(f => f.codes.open)),
				combineCodes(close, ...formats.map(f => f.codes.close)),
				reset,
			),
		},
	));
}