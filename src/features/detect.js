"use strict";

/** @typedef {import("./types").ColorDepth} ColorDepth */
/** @typedef {import("./types").Features}   Features */

/** @type {(stream?: NodeJS.WriteStream) => ColorDepth} */
function getColorDepth(stream) {
	if (stream?.isTTY)
		return /** @type {ColorDepth} */(stream.getColorDepth());

	if (process.env.NO_COLOR || process.env.NODE_DISABLE_COLORS)
		return 1;

	switch (process.env.FORCE_COLOR) {
		case "":
		case "true":
		case "1":
			return 4;
		case "2":
			return 8;
		case "3":
			return 24;
		default:
			return 1;
	}
}

/** @type {(isTTY: boolean, colorDepth: ColorDepth) => Omit<Features, "colorDepth">} */
function detectFeatureSupport(isTTY, colorDepth) {
	const enabled = process.env.TERM !== "dumb" && isTTY;
	return {
		style    : colorDepth > 1,
		caret    : enabled,
		erase    : enabled,
		scroll   : enabled,
		terminal : enabled,
	};
}

module.exports = {detectFeatureSupport, getColorDepth}