import {define}       from "@peteanderson/props";
import {combineCodes} from "./combine";
import {lazy}         from "./lazy";

import type {ChainBuilder, ChainKey, Code, Format, FormatBase, FormatBuilder} from "./types";

const codeSequence = (code: Code): string | number =>
	Array.isArray(code)
		? code.map(c => c ? c : "").join(';')
		: code ? code : "";

const chain = <Keys extends ChainKey>(
	makeChain  : ChainBuilder,
	keys       : ReadonlySet<Keys>,
	baseFormat : FormatBase,
): Format<Keys> => !keys.size
	? baseFormat as Format<Keys>
	: lazy.add(baseFormat, "and", () => makeChain(keys, baseFormat));

export const makeFormatBuilder = (makeChain: ChainBuilder): FormatBuilder =>
	function format(keys, open, close, reset) {
		const empty         = Array.isArray(open) && !open.length;
		const openCode      = empty ? "" : codeSequence(open);
		const closeCode     = empty ? "" : codeSequence(close);
		const openSequence  = empty ? "" :`\x1b[${openCode}m`;
		const closeSequence = empty ? "" :`\x1b[${closeCode}m`;
		const reopenCode    = reset && !empty ? `${closeCode};${openCode}` : openCode;

		const rxClose = new RegExp(
			`(?<start>\\x1b\\[(?:\\d+;)*)${closeCode}(?<end>(?:;\\d+)*m)`,
			"g"
		);
		const replace = `$<start>${reopenCode}$<end>`;

		return chain(makeChain, keys, define(
			empty
				? (s: string) => s
				: (s: string) => s ? openSequence + s.replace(rxClose, replace) + closeSequence : s,
			{
				open    : {value: openSequence,  enumerable: true},
				close   : {value: closeSequence, enumerable: true},
				codes   : {value: {open, close}, enumerable: true},
				combine : {
					value: (...formats: [FormatBase, ...FormatBase[]]) => format(
						keys,
						combineCodes(open,  ...formats.map(f => f.codes.open)),
						combineCodes(close, ...formats.map(f => f.codes.close)),
						reset,
					),
					enumerable: true,
				},
			},
		));
	};