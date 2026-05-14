"use strict";

const caret                    = require("./caret");
const erase                    = require("./erase");
const scroll                   = require("./scroll");
const {bg, fg, reset, style}   = require("./sgr");
const {simplify}               = require("./simplify");
const {sanitize, slice, strip} = require("./strip");

const ansi = {
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
	simplify,
};

module.exports = ansi;