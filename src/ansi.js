"use strict";

const caret                    = require("./caret");
const erase                    = require("./erase");
const scroll                   = require("./scroll");
const {bg, fg, reset, style}   = require("./sgr");
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
};

module.exports = ansi;