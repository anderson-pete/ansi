"use strict";

const {colorDepth, enabled}    = require("./caps");
const caret                    = require("./caret");
const erase                    = require("./erase");
const scroll                   = require("./scroll");
const {bg, fg, reset, style}   = require("./sgr");
const {sanitize, slice, strip} = require("./strip");

const ansi = {
	colorDepth,
	enabled,

	caret,
	erase,
	scroll,

	reset,
	style,
	fg,
	bg,

	strip,
	sanitize,
	slice,
};

module.exports = ansi;