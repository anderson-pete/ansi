import type {Code} from "#types";

export const codeSequence = (code: Code): string | number =>
	Array.isArray(code) ? code.join(";") : code;

const isDisabled = (code: Code): boolean => Array.isArray(code) && !code.length;

export function csi(command: string): string;
export function csi(params: Code, command: string): string;
export function csi(...args: [string] | [Code, string]): string {
	const command = args.pop() as string;
	const params  = args.pop() as Code | undefined ?? "";

	return isDisabled(params) ? "" : `\x1b[${codeSequence(params)}${command}`;
}

const forwardOnlyCount = (code: string) => (count?: number): string => {
	if (count === 0 || count! < 0)
		return "";

	return csi(count === 1 || count === undefined ? "" : count, code);
};

const reversibleCount = (forwardCode: string, backwardCode: string) => (count?: number): string => {
	if (count === 0)
		return "";

	if (!count || count > 0)
		return csi(count === 1 || count === undefined ? "" : count, forwardCode);

	return csi(count === -1 ? "" : -count, backwardCode);
}

export const count = <Param extends [number?] = [count?: number]>(
	code          : string,
	negativeCode? : string,
): (...args: Param) => string =>
	negativeCode ? reversibleCount(code, negativeCode) : forwardOnlyCount(code);

export const noop = () => "";