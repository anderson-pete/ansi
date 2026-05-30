"use strict";

const scroll = {
	/** @type {(lines?: number) => string} */
	up   : lines => `\x1b[${lines ?? 1}S`,
	/** @type {(lines?: number) => string} */
	down : lines => `\x1b[${lines ?? 1}T`,
};

/** @type {typeof scroll} */
const disabled = {
	up   : () => "",
	down : () => "",
};

const makeScroll = (enabled = true) => enabled ? scroll : disabled;

module.exports = {makeScroll};