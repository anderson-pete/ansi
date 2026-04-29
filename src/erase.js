"use strict";

const erase = {
	line: {
		toStart: "\x1b[1K",
		toEnd  : "\x1b[0K",
		full   : "\x1b[2K",
	},
	screen: {
		toStart    : "\x1b[1J",
		toEnd      : "\x1b[0J",
		full       : "\x1b[2J",
		scrollback : "\x1b[3J",
	},
};

module.exports = erase;