import {Code}              from "#code";
import {codeSequence, csi} from "#utils";
import {define}            from "@peteanderson/props";
import {attachChain}       from "./chain";
import {combineCodes}      from "./combine";

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

	const format = attachChain(context, define(
		openSequence
			? (s: string) => s ? openSequence + s.replace(rxClose, replace) + closeSequence : s
			: (s: string) => s,
		{
			open    : {value: openSequence,  enumerable: true},
			close   : {value: closeSequence, enumerable: true},
			codes   : {value: {open, close}, enumerable: true},
			combine : {
				value: (...formats: [FormatBase, ...FormatBase[]]) => makeFormat(
					context,
					combineCodes(open,  ...formats.map(f => f.codes.open)),
					combineCodes(close, ...formats.map(f => f.codes.close)),
					reset,
				),
				enumerable: true,
			},
		},
	));

	context.registerFormat(format);
	return format;
};