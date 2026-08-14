import {csi} from "./utils";

const erase = {
	line: {
		toStart : csi("1K"),
		toEnd   : csi("0K"),
		full    : csi("2K"),
	},
	screen: {
		toStart    : csi("1J"),
		toEnd      : csi("0J"),
		full       : csi("2J"),
		scrollback : csi("3J"),
	},
};

export type Erase = typeof erase;

const disabled: Erase = {
	line: {
		toStart : "",
		toEnd   : "",
		full    : "",
	},
	screen: {
		toStart    : "",
		toEnd      : "",
		full       : "",
		scrollback : "",
	},
};

export const makeErase = (enabled = true): Erase => enabled ? erase : disabled;