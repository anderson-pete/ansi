export function csi(command: string): string;
export function csi(params: string | number | undefined, command: string): string;
export function csi(...args: [string] | [string | number | undefined, string]): string {
	const command = args.pop() as string;
	const params  = args.pop();

	return `\x1b[${params === undefined ? "" : params}${command}`;
}

export const count = <Param extends [number?] = [count?: number]>(
	code: string
): (...args: Param) => string =>
	(count?: number): string => count === 0 ? "" : csi(count === 1 ? undefined : count, code);

export const noop = () => "";