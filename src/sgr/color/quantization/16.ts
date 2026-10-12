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