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