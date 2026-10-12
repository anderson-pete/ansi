export function rgbToX8(r: number, g: number, b: number): number {
	r = r >= 128 ? 1 : 0;
	g = g >= 128 ? 1 : 0;
	b = b >= 128 ? 1 : 0;

	return (r ? 1 : 0) | (g ? 2 : 0) | (b ? 4 : 0);
}