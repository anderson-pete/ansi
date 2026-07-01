import {clip, rgbToX256, rgbToX16, rgbToX8, x256ToRgb} from "./utils";

import type {Channel, Format} from "../types";
import type {Context}         from "./context";

export function makeRGB(ctx: Context): Channel["rgb"] {
	const {colorDepth, channel, build, open, x16ToX8} = ctx;

	return (
		colorDepth >= 24 ? (r, g, b) => build([open + 8, 2, ...clip(r, g, b)]) :
		colorDepth >=  8 ? (r, g, b) => build([open + 8, 5, rgbToX256(...clip(r, g, b))]) :
		colorDepth >=  4 ? (r, g, b) => build(open + rgbToX16(...clip(r, g, b))) :
		colorDepth === 3 ?
			channel === "fg" ?
				(r, g, b) => x16ToX8(rgbToX16(...clip(r, g, b))) :
				(r, g, b) => build(open + rgbToX8(...clip(r, g, b))) :
		() => build(0)
	);
}

export function makeX256(ctx: Context): (...args: [number] | [number, number, number]) => Format {
	const {colorDepth, channel, build, open, x16ToX8} = ctx;

	return (
		colorDepth >= 8 ?
			(...args) => build(
				[open + 8, 5, args.length === 3 ? rgbToX256(...clip(...args)) : clip(args[0])],
			) :
		colorDepth >= 4 ?
			(...args) => build(
				open +
				rgbToX16(...(args.length === 3 ? clip(...args) : x256ToRgb(clip(args[0])))),
			) :
		colorDepth === 3 ?
			channel === "fg" ?
				(...args) => x16ToX8(
					args.length === 3 ?
						rgbToX16(...clip(...args)) :
						rgbToX16(...x256ToRgb(clip(args[0]))),
				) :
				(...args) => build(
					open + rgbToX8(
						...args.length === 3 ? clip(...args) : x256ToRgb(clip(args[0])),
					),
				) :
		() => build(0)
	);
}