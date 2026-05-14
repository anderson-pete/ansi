"use strict";

const {reset} = require("./sgr");

const rxCSI    = /\x1b\[[0-?]*[ -/]*[@-~]/g;
const rxUnsafe = /\x1b\[[0-?]*[ -/]*[@-ln-~]/g; // Everything except SGR codes (m).

/**
 * Remove all ANSI escape codes from the given text.
 * @type {(text: string) => string}
 */
const strip = text => text.replace(rxCSI, '');

/**
 * Remove all ANSI escape codes except SGR codes (m), which are used for color and styling.
 * @type {(text: string) => string}
 */
const sanitize = text => text.replace(rxUnsafe, '');

/** @type {(text: string, start: number, end: number) => string} */
function slice(text, start, end) {
	if (start < 0 || end < 0) {
		const visibleLength = strip(text).length;
		if (start < 0)
			start = Math.max(0, visibleLength + start);
		if (end < 0)
			end = Math.max(0, visibleLength + end);
	}
	if (start > end)
		return "";

	let visibleIndex = 0;
	let startIndex   = 0;

	while (startIndex < text.length && visibleIndex < start) {
		if (text[startIndex] === "\x1b") {
			rxCSI.lastIndex = startIndex;
			const match = rxCSI.exec(text);
			if (match?.index === startIndex) {
				startIndex += match[0].length;
				continue;
			}
		}

		startIndex++;
		visibleIndex++;
	}

	let endIndex = startIndex;
	let hasAnsi  = false;
	while (endIndex < text.length && visibleIndex < end) {
		if (text[endIndex] === "\x1b") {
			rxCSI.lastIndex = endIndex;
			const match = rxCSI.exec(text);
			if (match?.index === endIndex) {
				endIndex += match[0].length;
				hasAnsi = true;
				continue;
			}
		}

		endIndex++;
		visibleIndex++;
	}

	return text.slice(startIndex, endIndex) + (hasAnsi ? reset : "");
};

module.exports = {strip, sanitize, slice};