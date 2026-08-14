import {csi} from "./utils";

const terminal = {
	focusReporting: {
		enable  : csi("?1004h"),
		disable : csi("?1004l"),
		focus   : csi("I"),
		blur    : csi("O"),
	},

	alternateScreen: {
		enable  : csi("?1049h"),
		disable : csi("?1049l"),

		legacy: {
			enable  : csi("?47h"),
			disable : csi("?47l"),
		},
	},

	bracketedPaste: {
		enable  : csi("?2004h"),
		disable : csi("?2004l"),
		start   : csi("200~"),
		end     : csi("201~"),
	},
};

export type Terminal = typeof terminal;

const disabled: Terminal = {
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

export const makeTerminal = (enabled = true): Terminal => enabled ? terminal : disabled;