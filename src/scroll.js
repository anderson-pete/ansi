"use strict";

const scroll = {
	/** @type {(lines?: number) => string} */
	up   : lines => `\x1b[${lines ?? 1}S`,
	/** @type {(lines?: number) => string} */
	down : lines => `\x1b[${lines ?? 1}T`,
};

module.exports = scroll;