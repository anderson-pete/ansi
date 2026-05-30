"use strict";

const {makeCaret}                       = require("./caret");
const {makeErase}                       = require("./erase");
const {getFeatures}                     = require("./features");
const {makeScroll}                      = require("./scroll");
const {makeColor, makeReset, makeStyle} = require("./sgr");
const {simplify}                        = require("./simplify");
const {slice}                           = require("./slice");
const {sanitize, strip, visibleLength}  = require("./strip");

/**
@typedef {import("./features/features").Args} Args

@typedef {ReturnType<typeof makeColor> & {
	caret  : ReturnType<typeof makeCaret>;
	erase  : ReturnType<typeof makeErase>;
	scroll : ReturnType<typeof makeScroll>;

	reset : string;
	style : ReturnType<typeof makeStyle>;

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