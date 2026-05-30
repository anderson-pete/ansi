"use strict";

const {makeSGR} = require("./sgr");

function makeStyle(enabled = true) {
	const sgr = makeSGR(enabled);

	return {
		bold            : sgr(1, 22, true),
		dim             : sgr(2, 22, true),
		italic          : sgr(3, 23),
		underline       : sgr(4, 24),
		inverse         : sgr(7, 27),
		hidden          : sgr(8, 28),
		strikethrough   : sgr(9, 29),
		doubleUnderline : sgr(21, 24),
		frame           : sgr(51, 54),
		encircle        : sgr(52, 54),
		overline        : sgr(53, 55),
	};
}

module.exports = {makeStyle};