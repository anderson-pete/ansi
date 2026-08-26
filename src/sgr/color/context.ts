import {Code}         from "#code";
import {combineCodes} from "../combine";

import type {ColorDepth}                        from "#features";
import type {ChainKey}                          from "../chain";
import type {Format, FormatBase, FormatBuilder} from "../format-builder";
import type {Style}                             from "../style";
import type {ColorKey}                          from "./color";

const codes = (open: number) => ({
	open     : open as Code,
	close    : open + 9 as Code,
	offset   : (delta: number): Code => open + delta,
	extended : (...args: number[]): Code => [open + 8, ...args],
});

const baseCodes = {fg: codes(30), bg: codes(40)};

const disabledCodes: ReturnType<typeof codes> = {
	open     : Code.disabled,
	close    : Code.disabled,
	offset   : () => Code.disabled,
	extended : () => Code.disabled,
};

export function buildContext(
	keys          : ReadonlySet<ChainKey>,
	makeFormatter : FormatBuilder,
	style         : Style,
	colorDepth    : ColorDepth,
	channel       : ColorKey
) {
	const {open, close, extended, offset} = colorDepth > 1 ? baseCodes[channel] : disabledCodes;

	const build   = (open: Code): Format => makeFormatter(keys, open, close);
	const combine = (base: FormatBase, style: FormatBase): Format => makeFormatter(
		keys,
		combineCodes(base.codes.open,  style.codes.open),
		combineCodes(base.codes.close, style.codes.close),
	);

	const bright: (index: number) => Format =
		colorDepth >= 4 ? index => build(offset(60 + index)) :
		colorDepth === 3 ?
			channel === "fg" ?
				index => combine(style.bold, build(offset(index))) :
				index => build(offset(index)) :
		() => build(Code.disabled);

	const x16ToX8: (code: number) => Format =
		channel === "fg"
			? code => code >= 60 ? bright(code - 60) : build(offset(code))
			: code => build(offset(code % 60));

	return {colorDepth, channel, open, close, offset, extended, build, bright, x16ToX8};
}

export type Context = ReturnType<typeof buildContext>;