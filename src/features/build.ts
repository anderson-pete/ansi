import {detectFeatureSupport, getColorDepth} from "./detect";

import type {ColorDepth, Features} from "./types";

function normalizeColorDepth(colorDepth: number): ColorDepth {
	colorDepth = Math.floor(colorDepth);
	if (colorDepth >= 24) return 24;
	if (colorDepth >= 8)  return 8;
	if (colorDepth >= 4)  return 4;
	if (colorDepth === 3) return 3;
	return 1;
}

export function build(
	isTTY      : boolean,
	colorDepth : ColorDepth,
	style?     : boolean,
	caret?     : boolean,
	erase?     : boolean,
	scroll?    : boolean,
	terminal?  : boolean,
): Features {
	if (
		style    !== undefined &&
		caret    !== undefined &&
		erase    !== undefined &&
		scroll   !== undefined &&
		terminal !== undefined
	)
		return {colorDepth: normalizeColorDepth(colorDepth), style, caret, erase, scroll, terminal};

	const support = detectFeatureSupport(isTTY, colorDepth);
	return {
		colorDepth : normalizeColorDepth(colorDepth),
		style      : style    ?? support.style,
		caret      : caret    ?? support.caret,
		erase      : erase    ?? support.erase,
		scroll     : scroll   ?? support.scroll,
		terminal   : terminal ?? support.terminal,
	};
}

export const boolean = (isTTY: boolean, enabled: boolean): Features =>
	build(isTTY, enabled ? 4 : 1);

export const number = (isTTY: boolean, colorDepth: ColorDepth): Features =>
	build(isTTY, colorDepth);

export const tty = (stream: NodeJS.WriteStream): Features =>
	build(true, getColorDepth(stream));

export const pipe = (): Features =>
	build(false, getColorDepth());