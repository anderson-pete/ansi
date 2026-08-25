import {codeSequence, csi} from "#utils";
import {define}            from "@peteanderson/props";
import {combineCodes}      from "./combine";
import {lazy}              from "./lazy";

import type {ChainBuilder, ChainKey, Format, FormatBase, FormatBuilder} from "./types";

const chain = <Keys extends ChainKey>(
	makeChain  : ChainBuilder,
	keys       : ReadonlySet<Keys>,
	baseFormat : FormatBase,
): Format<Keys> => !keys.size
	? baseFormat as Format<Keys>
	: lazy.add(baseFormat, "and", () => makeChain(keys, baseFormat));

export const makeFormatBuilder = (makeChain: ChainBuilder): FormatBuilder =>
	function format(keys, open, close, reset) {
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

		return chain(makeChain, keys, define(
			openSequence
				? (s: string) => s ? openSequence + s.replace(rxClose, replace) + closeSequence : s
				: (s: string) => s,
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