export function csi(command: string): string;
export function csi(params: string | number | undefined, command: string): string;
export function csi(...args: [string] | [string | number | undefined, string]): string {
	const command = args.pop() as string;
	const params  = args.pop();

	return `\x1b[${params === undefined ? "" : params}${command}`;
}

const forwardOnlyCount = (code: string) => (count?: number): string => {
	if (count === 0 || count! < 0)
		return "";

	return csi(count === 1 ? undefined : count, code);
};

const reversibleCount = (forwardCode: string, backwardCode: string) => (count?: number): string => {
	if (count === 0)
		return "";

	if (!count || count > 0)
		return csi(count === 1 ? undefined : count, forwardCode);

	return csi(count === -1 ? undefined : -count, backwardCode);
}

export const count = <Param extends [number?] = [count?: number]>(
	code          : string,
	negativeCode? : string,
): (...args: Param) => string =>
	negativeCode ? reversibleCount(code, negativeCode) : forwardOnlyCount(code);

export const noop = () => "";