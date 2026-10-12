type LAB = [number, number, number];
type RGB = [number, number, number];

function srgbToLinear(c: number): number {
	c /= 255;
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function rgbToLab(r: number, g: number, b: number): LAB {
	r = srgbToLinear(r);
	g = srgbToLinear(g);
	b = srgbToLinear(b);

	const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
	const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
	const z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) / 1.08883;

	const f  = (v: number): number => v > 0.0088564517 ? Math.cbrt(v) : 7.787037 * v + 16 / 116;
	const fx = f(x), fy = f(y), fz = f(z);
	return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

/** Standard xterm palette for colors 0-15. */
export const x16Palette: RGB[] = [
	[  0,   0,   0],
	[205,   0,   0],
	[  0, 205,   0],
	[205, 205,   0],
	[  0,   0, 238],
	[205,   0, 205],
	[  0, 205, 205],
	[229, 229, 229],
	[127, 127, 127],
	[255,   0,   0],
	[  0, 255,   0],
	[255, 255,   0],
	[ 92,  92, 255],
	[255,   0, 255],
	[  0, 255, 255],
	[255, 255, 255],
];

const x16SaturationBoost = 3;
const x16LabPalette      = x16Palette.map(([r, g, b]) => rgbToLab(r, g, b));

export function rgbToX16(r: number, g: number, b: number): number {
	// Nearest-color matching favors the grays for muted colors, so exaggerate saturation first.
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	if (max > min) {
		const k = Math.min(max / (max - min), x16SaturationBoost);
		r = max - (max - r) * k;
		g = max - (max - g) * k;
		b = max - (max - b) * k;
	}

	const [l, a, b2] = rgbToLab(r, g, b);
	let best     = 0;
	let bestDist = Infinity;

	for (let i = 0; i < 16; i++) {
		const [pl, pa, pb] = x16LabPalette[i];
		const distance = (l - pl) ** 2 + (a - pa) ** 2 + (b2 - pb) ** 2;
		if (distance < bestDist) {
			bestDist = distance;
			best     = i;
		}
	}
	return best;
}