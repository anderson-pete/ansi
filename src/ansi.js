"use strict";

const {makeCaret}                       = require("./caret");
const {makeErase}                       = require("./erase");
const {getFeatures}                     = require("./features");
const {padEnd, padStart}                = require("./pad");
const {makeScroll}                      = require("./scroll");
const {makeColor, makeReset, makeStyle} = require("./sgr");
const {simplify}                        = require("./simplify");
const {slice}                           = require("./slice");
const {sanitize, strip, visibleLength}  = require("./strip");
const {makeTerminal}                    = require("./terminal");

/**
@typedef {import("./features/features").Args} Args

@typedef {ReturnType<typeof makeColor> & {
	caret  : ReturnType<typeof makeCaret>;
	erase  : ReturnType<typeof makeErase>;
	scroll : ReturnType<typeof makeScroll>;

	reset : string;
	style : ReturnType<typeof makeStyle>;

	terminal : ReturnType<typeof makeTerminal>;

	padEnd   : typeof padEnd;
	padStart : typeof padStart;

	strip         : typeof strip;
	visibleLength : typeof visibleLength;
	sanitize      : typeof sanitize;
	slice         : typeof slice;
	simplify      : typeof simplify;

	features : ReturnType<typeof getFeatures>;
}} Ansi
*/

/** @type {(...args: Args) => Ansi}*/
function makeAnsi(...args) {
	const features = getFeatures(...args);

	return {
		caret  : makeCaret(features.caret),
		erase  : makeErase(features.erase),
		scroll : makeScroll(features.scroll),

		reset : makeReset(features.colorDepth > 1),
		style : makeStyle(features.style),
		...makeColor(features.colorDepth),

		terminal: makeTerminal(features.terminal),

		padEnd,
		padStart,

		strip,
		visibleLength,
		sanitize,
		slice,
		simplify,

		features,
	};
}

const ansi = Object.assign(makeAnsi, makeAnsi());

module.exports = ansi;