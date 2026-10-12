export function clip(x: number): number;
export function clip(r: number, g: number, b: number): [number, number, number];
export function clip(...args: [number] | [number, number, number]): number | [number, number, number] {
	return args.length === 1 ?
		Math.max(0, Math.min(255, Math.floor(args[0]))) :
		[
			Math.max(0, Math.min(255, Math.floor(args[0]))),
			Math.max(0, Math.min(255, Math.floor(args[1]))),
			Math.max(0, Math.min(255, Math.floor(args[2]))),
		];
}