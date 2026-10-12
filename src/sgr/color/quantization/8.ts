export const rgbToX8 = (r: number, g: number, b: number): number =>
	(r >= 128 ? 1 : 0) |
	(g >= 128 ? 2 : 0) |
	(b >= 128 ? 4 : 0);