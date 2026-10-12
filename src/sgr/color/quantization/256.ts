import {x16Palette} from "./16";

const cubeLevels = [0, 95, 135, 175, 215, 255];

const cubeIndex = (c: number): number => c < 48 ? 0 : c < 115 ? 1 : Math.floor((c - 35) / 40);

export function rgbToX256(r: number, g: number, b: number): number {
	const ri = cubeIndex(r),   gi = cubeIndex(g),   bi = cubeIndex(b);
	const cr = cubeLevels[ri], cg = cubeLevels[gi], cb = cubeLevels[bi];

	const avg  = Math.round((r + g + b) / 3);
	const gi2  = Math.min(23, Math.max(0, Math.round((avg - 8) / 10)));
	const gray = 8 + gi2 * 10;

	const distance = (x: number, y: number, z: number): number =>
		(r - x) ** 2 + (g - y) ** 2 + (b - z) ** 2;

	return distance(gray, gray, gray) < distance(cr, cg, cb)
		? 232 + gi2
		: 16 + 36 * ri + 6 * gi + bi;
}

export function x256ToRgb(code: number): [number, number, number] {
	if (code < 16)
		return x16Palette[code];

	if (code < 232) {
		code -= 16;
		return [
			cubeLevels[Math.floor(code / 36)],
			cubeLevels[Math.floor((code % 36) / 6)],
			cubeLevels[code % 6]
		];
	}

	// grayscale
	const gray = 8 + (code - 232) * 10;
	return [gray, gray, gray];
}