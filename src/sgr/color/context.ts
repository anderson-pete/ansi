import {Code}         from "#code";
import {combineCodes} from "../combine";
import {makeFormat}   from "../format";

import type {FormatContext}      from "../context";
import type {Format, FormatBase} from "../format";
import type {ColorKey}           from "./color";

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

export function buildChannelContext(formatContext: FormatContext, channel: ColorKey) {
	const {colorDepth}                    = formatContext.features;
	const {open, close, extended, offset} = colorDepth > 1 ? baseCodes[channel] : disabledCodes;

	const build   = (open: Code): Format => makeFormat(formatContext, open, close);
	const combine = (base: FormatBase, style: FormatBase): Format => makeFormat(
		formatContext,
		combineCodes(base.codes.open,  style.codes.open),
		combineCodes(base.codes.close, style.codes.close),
	);

	const bright: (index: number) => Format =
		colorDepth >= 4 ? index => build(offset(60 + index)) :
		colorDepth === 3 ?
			channel === "fg" ?
				index => combine(formatContext.style.bold, build(offset(index))) :
				index => build(offset(index)) :
		() => build(Code.disabled);

	const x16ToX8: (code: number) => Format =
		channel === "fg"
			? code => code >= 60 ? bright(code - 60) : build(offset(code))
			: code => build(offset(code % 60));

	return {colorDepth, channel, open, close, offset, extended, build, bright, x16ToX8};
}

export type ChannelContext = ReturnType<typeof buildChannelContext>;