import {combineCodes} from "../combine";

import type {ColorDepth} from "../../features";
import type {ChainKey, Code, ColorKey, Format, FormatBase, FormatBuilder, Style} from "../types";

const baseCodes = {
	fg: {open: 30, close: 39},
	bg: {open: 40, close: 49},
};

export function buildContext(
	keys          : ReadonlySet<ChainKey>,
	makeFormatter : FormatBuilder,
	style         : Style,
	colorDepth    : ColorDepth,
	channel       : ColorKey
) {
	const {open, close} = baseCodes[channel];

	const build = colorDepth > 1
		? (open: Code): Format => makeFormatter(keys, open, close)
		: () => makeFormatter(keys, [], []);

	const combine = (base: FormatBase, style: FormatBase): Format => makeFormatter(
		keys,
		combineCodes(base.codes.open,  style.codes.open),
		combineCodes(base.codes.close, style.codes.close),
	);

	const bright: (index: number) => Format =
		colorDepth >= 4 ? index => build(open + 60 + index) :
		colorDepth === 3 ?
			channel === "fg" ?
				index => combine(style.bold, build(open + index)) :
				index => build(open + index) :
		() => build([]);

	const x16ToX8: (code: number) => Format =
		channel === "fg" ?
			code => code >= 60 ? combine(style.bold, build(open + code - 60)) : build(open + code) :
			code => code >= 60 ? build(open + code - 60) : build(open + code);

	return {colorDepth, channel, open, close, build, bright, x16ToX8};
}

export type Context = ReturnType<typeof buildContext>;