import {define} from "@peteanderson/props";
import {lazy}   from "./lazy";

import type {ChainBuilder, ChainKey, Code, Format, FormatBase, FormatBuilder} from "./types";

const codeSequence = (code: Code): string | number => Array.isArray(code) ? code.join(';') : code;

const chain = <Keys extends ChainKey>(
	makeChain  : ChainBuilder,
	keys       : ReadonlySet<Keys>,
	baseFormat : FormatBase,
): Format<Keys> => !keys.size
	? baseFormat as Format<Keys>
	: lazy.add(baseFormat, "and", () => makeChain(keys, baseFormat));

export function makeFormatBuilder(makeChain: ChainBuilder, enabled = true): FormatBuilder {
	if (enabled) {
		return (keys, open, close, reset) => {
			const openCode      = codeSequence(open);
			const closeCode     = codeSequence(close);
			const openSequence  = `\x1b[${openCode}m`;
			const closeSequence = `\x1b[${closeCode}m`;
			const reopenCode    = reset ? `${closeCode};${openCode}` : openCode;

			const rxClose = new RegExp(
				`(?<start>\\x1b\\[(?:\\d+;)*)${closeCode}(?<end>(?:;\\d+)*m)`,
				"g"
			);
			const replace = `$<start>${reopenCode}$<end>`;

			return chain(makeChain, keys, define(
				(s: string) => s ? openSequence + s.replace(rxClose, replace) + closeSequence : s,
				{
					open  : {value: openSequence,  enumerable: true},
					close : {value: closeSequence, enumerable: true},
					codes : {value: {open, close}, enumerable: true},
				},
			));
		};
	}

	return keys => chain(makeChain, keys, define((s: string) => s, {
		open  : {value: "", enumerable: true},
		close : {value: "", enumerable: true},
		codes : {value: {open: [], close: []}, enumerable: true},
	}));
}