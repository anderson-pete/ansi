"use strict";

const terminal = {
	focusReporting: {
		enable  : "\x1b[?1004h",
		disable : "\x1b[?1004l",
		focus   : "\x1b[I",
		blur    : "\x1b[O",
	},

	alternateScreen: {
		enable  : "\x1b[?1049h",
		disable : "\x1b[?1049l",

		legacy: {
			enable  : "\x1b[?47h",
			disable : "\x1b[?47l",
		},
	},

	bracketedPaste: {
		enable  : "\x1b[?2004h",
		disable : "\x1b[?2004l",
		start   : "\x1b[200~",
		end     : "\x1b[201~",
	},
};

/** @type {typeof terminal} */
const disabled = {
	focusReporting: {
		enable  : "",
		disable : "",
		focus   : "",
		blur    : "",
	},

	alternateScreen: {
		enable  : "",
		disable : "",

		legacy: {
			enable  : "",
			disable : "",
		},
	},

	bracketedPaste: {
		enable  : "",
		disable : "",
		start   : "",
		end     : "",
	},
};

const makeTerminal = (enabled = true) => enabled ? terminal : disabled;

module.exports = {makeTerminal};