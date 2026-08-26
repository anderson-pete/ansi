import {Code}                                          from "#code";
import {clip, rgbToX256, rgbToX16, rgbToX8, x256ToRgb} from "./utils";

import type {Format}         from "../format";
import type {Channel}        from "./channel";
import type {ChannelContext} from "./context";

export function makeRGB(ctx: ChannelContext): Channel["rgb"] {
	const {colorDepth, channel, build, offset, extended, x16ToX8} = ctx;

	return (
		colorDepth >= 24 ? (r, g, b) => build(extended(2, ...clip(r, g, b))) :
		colorDepth >=  8 ? (r, g, b) => build(extended(5, rgbToX256(...clip(r, g, b)))) :
		colorDepth >=  4 ? (r, g, b) => build(offset(rgbToX16(...clip(r, g, b)))) :
		colorDepth === 3 ?
			channel === "fg" ?
				(r, g, b) => x16ToX8(rgbToX16(...clip(r, g, b))) :
				(r, g, b) => build(offset(rgbToX8(...clip(r, g, b)))) :
		() => build(Code.disabled)
	);
}

type X256 = (...args: [number] | [number, number, number]) => Format;

export function makeX256(ctx: ChannelContext): X256 {
	const {colorDepth, channel, build, offset, extended, x16ToX8} = ctx;

	return (
		colorDepth >= 8 ?
			(...args) => build(
				extended(5, args.length === 3 ? rgbToX256(...clip(...args)) : clip(args[0])),
			) :
		colorDepth >= 4 ?
			(...args) => build(
				offset(rgbToX16(...(args.length === 3 ? clip(...args) : x256ToRgb(clip(args[0]))))),
			) :
		colorDepth === 3 ?
			channel === "fg" ?
				(...args) => x16ToX8(
					args.length === 3 ?
						rgbToX16(...clip(...args)) :
						rgbToX16(...x256ToRgb(clip(args[0]))),
				) :
				(...args) => build(offset(rgbToX8(
					...args.length === 3 ? clip(...args) : x256ToRgb(clip(args[0])),
				))) :
		() => build(Code.disabled)
	);
}