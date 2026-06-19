export type Code = number | number[];

export interface SGR {
	(text: string): string;
	open    : string;
	close   : string;
	codes   : {open: Code; close: Code};
	combine : (...styles: SGR[]) => SGR;
}

function combine(code: Code, codes: Code[]): Code {
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

const codeSequence = (code: Code): string | number => Array.isArray(code) ? code.join(";") : code;

function sgr(open: Code, close: Code, reset = false): SGR {
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

	const func = (s: string) => s ? openSequence + s.replace(rxClose, replace) + closeSequence : s;

	return Object.assign(func, {
		codes   : {open, close},
		open    : openSequence,
		close   : closeSequence,
		combine : (...styles: SGR[]) => sgr(
			combine(open, styles.map(s => s.codes.open)),
			combine(close, styles.map(s => s.codes.close)),
		),
	});
}

const disabledSGR: SGR = Object.assign((s: string) => s, {
	codes   : {open: 0, close: 0},
	open    : "",
	close   : "",
	combine : (): SGR => disabledSGR,
});

const disabled: typeof sgr = () => disabledSGR;

export const makeSGR = (enabled = true): typeof sgr => enabled ? sgr : disabled;