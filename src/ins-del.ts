import {count, csi, noop} from "./utils";

const erase = {
	char: count("X"),

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

const insert = {
	char: count("@"),
	line: count("L"),
};

const del = {
	char: count("P"),
	line: count("M"),
};

export type Erase  = typeof erase;
export type Insert = typeof insert;
export type Delete = typeof del;

const disabledErase: Erase = {
	char: noop,

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

const disabledInsert: Insert = {
	char: noop,
	line: noop,
};

const disabledDelete: Delete = disabledInsert;

export const makeErase  = (enabled = true): Erase  => enabled ? erase  : disabledErase;
export const makeInsert = (enabled = true): Insert => enabled ? insert : disabledInsert;
export const makeDelete = (enabled = true): Delete => enabled ? del    : disabledDelete;