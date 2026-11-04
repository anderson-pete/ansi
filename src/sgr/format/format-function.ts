import {codeSequence} from "#utils";

import type {Code} from "#code";

export type FormatFunction = (text: string) => string;

/**
 * Returns a function that makes the core of a format, the function that wraps text in the format's
 * open and close sequences, given the format's open code. The wrapped text is re-opened after any
 * embedded occurrence of the close sequence, so that nested formats don't cut the outer one short.
 * What that takes depends only on the close code and `reset`, so it's prepared once here, and
 * shared by every function made by the returned function.
 */
export function makeFormatFunction(
	close         : Code,
	closeSequence : string,
	reset?        : boolean,
): (open: Code, openSequence: string) => FormatFunction {
	const closeCode = codeSequence(close);

	let rxClose: RegExp | undefined;

	const makeRx = () => new RegExp(
		`(?<start>\\x1b\\[(?:\\d+;)*)${closeCode}(?<end>(?:;\\d+)*m)`,
		"g"
	);

	const reopen = (open: Code): string => {
		const openCode = codeSequence(open);
		return `$<start>${reset ? `${closeCode};${openCode}` : openCode}$<end>`;
	};

	return (open, openSequence) => {
		let replace: string | undefined;

		return text =>
			text ?
				openSequence +
				text.replace(rxClose ??= makeRx(), replace ??= reopen(open)) +
				closeSequence
			: text;
	};
}