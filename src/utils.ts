import {Code} from "#code";

export function codeSequence(code: Code): string | number {
	if (!Array.isArray(code))
		return code;

	// A loop is considerably faster than `join` for the short arrays we deal with. Like `join`, it
	// treats `undefined` and `null` as empty, which is how JavaScript callers omit arguments.
	let sequence = code.length ? `${code[0] ?? ""}` : "";

	for (let i = 1; i < code.length; i++)
		sequence += `;${code[i] ?? ""}`;

	return sequence;
}

export const csi = (command: string, params?: Code): string =>
	params && Code.isDisabled(params) ? "" : `\x1b[${codeSequence(params ?? "")}${command}`;

const forwardOnlyCount = (code: string) => (count?: number): string => {
	if (count === 0 || count! < 0)
		return "";

	return csi(code, count === 1 || count === undefined ? "" : count);
};

const reversibleCount = (forwardCode: string, backwardCode: string) => (count?: number): string => {
	if (count === 0)
		return "";

	if (!count || count > 0)
		return csi(forwardCode, count === 1 || count === undefined ? "" : count);

	return csi(backwardCode, count === -1 ? "" : -count);
}

export const count = <Param extends [number?] = [count?: number]>(
	code          : string,
	negativeCode? : string,
): (...args: Param) => string =>
	negativeCode ? reversibleCount(code, negativeCode) : forwardOnlyCount(code);

export const noop = () => "";