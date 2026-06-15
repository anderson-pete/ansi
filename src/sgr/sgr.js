"use strict";

/**
@typedef {number | number[]} Code
@typedef {{
	(text: string): string;
	open    : string;
	close   : string;
	codes   : {open: Code, close: Code};
	combine : (...styles: SGR[]) => SGR;
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
	const func = s => s ? openSequence + s.replace(rxClose, replace) + closeSequence : s;

	return Object.assign(func, {
		codes : {open, close},
		open  : openSequence,
		close : closeSequence,

		/** @type {(...styles: SGR[]) => SGR} */
		combine: (...styles) => sgr(
			combine(open, styles.map(s => s.codes.open)),
			combine(close, styles.map(s => s.codes.close)),
		),
	});
};

/** @type {SGR} */
const disabledSGR = Object.assign(/** @type {(text: string) => string} */ s => s, {
	codes   : {open: 0, close: 0},
	open    : "",
	close   : "",
	combine : () => disabledSGR,
});

/** @type {typeof sgr} */
const disabled = () => disabledSGR;

const makeSGR = (enabled = true) => enabled ? sgr : disabled;

module.exports = {makeSGR};