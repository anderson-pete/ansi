"use strict";

const caret                            = require("./caret");
const erase                            = require("./erase");
const scroll                           = require("./scroll");
const {bg, fg, reset, style}           = require("./sgr");
const {simplify}                       = require("./simplify");
const {slice}                          = require("./slice");
const {sanitize, strip, visibleLength} = require("./strip");

const ansi = {
	caret,
	erase,
	scroll,

	reset,
	style,
	fg,
	bg,

	strip,
	visibleLength,
	sanitize,
	slice,
	simplify,
};

module.exports = ansi;