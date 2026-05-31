"use strict";

const {getColorDepth, detectFeatureSupport} = require("./detect");

/** @typedef {import("./types").ColorDepth} ColorDepth */
/** @typedef {import("./types").Features}   Features */

/** @type {(colorDepth: number) => ColorDepth} */
function normalizeColorDepth(colorDepth) {
	colorDepth = Math.floor(colorDepth);
	if (colorDepth >= 24)
		return 24;
	if (colorDepth >= 8)
		return 8;
	if (colorDepth >= 4)
		return 4;
	if (colorDepth === 3)
		return 3;
	return 1;
}

/**
@type {
	(
		isTTY      : boolean,
		colorDepth : ColorDepth,
		style?     : boolean,
		caret?     : boolean,
		erase?     : boolean,
		scroll?    : boolean,
		terminal?  : boolean,
	) => Features
}
*/
function build(isTTY, colorDepth, style, caret, erase, scroll, terminal) {
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

/** @type {(isTTY: boolean, enabled: boolean) => Features} */
const boolean = (isTTY, enabled) => build(isTTY, enabled ? 4 : 1);

/** @type {(isTTY: boolean, colorDepth: ColorDepth) => Features} */
const number = (isTTY, colorDepth) => build(isTTY, colorDepth);

/** @type {(stream: NodeJS.WriteStream) => Features} */
const tty = stream => build(true, getColorDepth(stream));

/** @type {() => Features} */
const pipe = () => build(false, getColorDepth());

module.exports = {build, boolean, number, tty, pipe};