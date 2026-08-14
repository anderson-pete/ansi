import {csi, count as move, noop} from "./utils";

const cursor = {
	up       : move("A"),
	down     : move("B"),
	forward  : move("C"),
	backward : move("D"),
	nextLine : move("E"),
	prevLine : move("F"),

	// Don't use `move`/`count` here, because it will output an empty string if `x` is `0`, but the
	// terminal accepts `\x1b[0G` and will process it the same as `\x1b[1G`/`x1b[G`. Also, the
	// parameter for `move`/`count` is optional, but the parameter for `x` is required.
	x: (x: number) => csi(x, "G"),

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
		set: (x: number, y: number): string => csi(`${y};${x}H`),
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