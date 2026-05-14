"use strict";

const $codes = Symbol();

/**
@typedef {number | number[]} Code
@typedef {{
	(text: string): string;
	open     : string;
	close    : string;
	[$codes] : {open: Code, close: Code};
	combine  : (...styles: SGR[]) => SGR;
}} SGR
*/

/** @type {(code: Code, codes: Code[]) => Code} */
function combine(code, codes, ) {
	if (!codes.length)
		return code;

	const rtn = Array.isArray(code) ? [...code] : [code];

	for (const c of codes) {
		if (Array.isArray(c))
			rtn.push(...c);
		else
			rtn.push(c);
	}

	return rtn;
}

/** @type {(code: Code) => string | number} */
const codeSequence = code => Array.isArray(code) ? code.join(';') : code;

/** @type {(open: Code, close: Code, reset?: boolean) => SGR} */
function sgr(open, close, reset = false) {
	const openCode       = codeSequence(open);
	const closeCode      = codeSequence(close);
	const openSequence   = `\x1b[${openCode}m`;
	const closeSequence  = `\x1b[${closeCode}m`;
	const reopenCode     = reset ? `${closeCode};${openCode}` : openCode;

	const rxClose = new RegExp(
		`(?<start>\\x1b\\[(?:\\d+;)*)${closeCode}(?<end>(?:;\\d+)*m)`,
		"g"
	);
	const replace = `$<start>${reopenCode}$<end>`;

	/** @type {(text: string) => string} */
	const func = s => openSequence + s.replace(rxClose, replace) + closeSequence

	return Object.assign(func, {
		[$codes] : {open, close},
		open     : openSequence,
		close    : closeSequence,

		/** @type {(...styles: SGR[]) => SGR} */
		combine: (...styles) => sgr(
			combine(open, styles.map(s => s[$codes].open)),
			combine(close, styles.map(s => s[$codes].close)),
		),
	});
}

module.exports = {sgr};