export function rgbToX256(r: number, g: number, b: number): number {
	if (r === g && g === b) {
		// grayscale
		return 232 + Math.floor(r * 24 / 256);
	}

	// 6x6x6 color cube
	return (
		16 +
		Math.floor(r * 6 / 256) * 36 +
		Math.floor(g * 6 / 256) * 6 +
		Math.floor(b * 6 / 256)
	);
}

export function x256ToRgb(code: number): [number, number, number] {
	if (code >= 232) {
		// grayscale
		const gray = Math.round((code - 232) * 255 / 24);
		return [gray, gray, gray];
	}

	code -= 16;
	const r = Math.floor(code / 36) * 51;
	const g = Math.floor((code % 36) / 6) * 51;
	const b = (code % 6) * 51;
	return [r, g, b];
}

export function rgbToX16(r: number, g: number, b: number): number {
	// First calculate it as a 4x4x4 cube.
	r = Math.min(2, Math.floor(r / 85));
	g = Math.min(2, Math.floor(g / 85));
	b = Math.min(2, Math.floor(b / 85));

	// Which channels are "on" determines the hue (ANSI color index 0–7).
	const index = (r ? 1 : 0) | (g ? 2 : 0) | (b ? 4 : 0);

	// The bright bit is derived from the max channel level across all three.
	const twos   = (r === 2 ? 1 : 0) + (g === 2 ? 1 : 0) + (b === 2 ? 1 : 0);
	const ones   = (r === 1 ? 1 : 0) + (g === 1 ? 1 : 0) + (b === 1 ? 1 : 0);
	const bright = twos > 0 && twos >= ones;

	// Return value uses the SGR offset scheme: 0–7 for normal, 60–67 for bright.
	return index + (bright ? 60 : 0);
}

export function rgbToX8(r: number, g: number, b: number): number {
	r = r >= 128 ? 1 : 0;
	g = g >= 128 ? 1 : 0;
	b = b >= 128 ? 1 : 0;

	return (r ? 1 : 0) | (g ? 2 : 0) | (b ? 4 : 0);
}

export function clip(x: number): number;
export function clip(r: number, g: number, b: number): [number, number, number];
export function clip(
	...args: [number] | [number, number, number]
): number | [number, number, number] {
	return args.length === 1 ?
		Math.max(0, Math.min(255, Math.floor(args[0]))) :
		[
			Math.max(0, Math.min(255, Math.floor(args[0]))),
			Math.max(0, Math.min(255, Math.floor(args[1]))),
			Math.max(0, Math.min(255, Math.floor(args[2]))),
		];
}