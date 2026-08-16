import {csi, count as move, noop} from "./utils";

const cursor = {
	up       : move("A", "B"),
	down     : move("B", "A"),
	forward  : move("C", "D"),
	backward : move("D", "C"),
	nextLine : move("E", "F"),
	prevLine : move("F", "E"),

	x: (x: number) => csi(x < 2 ? undefined : x, "G"),

	// These are the old VT100 codes, but they're widely supported by old and new terminals. The
	// newer VT220 codes are standardized by ECMA and ISO, and are also widely supported, but might
	// not work in some older terminals. The VT220 codes are:
	//
	// ```
	// save    : csi("s"),
	// restore : csi("u"),
	// ```
	save    : "\x1b7",
	restore : "\x1b8",

	hide : csi("?25l"),
	show : csi("?25h"),

	position: {
		get: csi("6n"),
		set : (x: number, y: number): string => csi(
			x < 2 ? // Omit x if we can use the default.
				y < 2 ? undefined : y : // Omit y too if we can use both defaults.
			y < 2 ?
				`;${x}` :
			`${y};${x}`,
			"H", // "f" is equivalent, but "H" is more widely supported
		),
	},

	shape: {
		steadyBlock       : csi("2 q"),
		steadyBar         : csi("6 q"),
		steadyUnderline   : csi("4 q"),
		blinkingBlock     : csi("1 q"),
		blinkingBar       : csi("5 q"),
		blinkingUnderline : csi("3 q"),
		default           : csi("0 q"),
	},
};

export type Cursor = typeof cursor;

const disabled: Cursor = {
	up       : noop,
	down     : noop,
	forward  : noop,
	backward : noop,
	nextLine : noop,
	prevLine : noop,

	x: noop,

	save    : "",
	restore : "",

	hide : "",
	show : "",

	position: {
		get: "",
		set: noop,
	},

	shape: {
		steadyBlock       : "",
		steadyBar         : "",
		steadyUnderline   : "",
		blinkingBlock     : "",
		blinkingBar       : "",
		blinkingUnderline : "",
		default           : "",
	},
};

export const makeCursor = (enabled = true): Cursor => enabled ? cursor : disabled;