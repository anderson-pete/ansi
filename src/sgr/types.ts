export type ColorKey = "fg" | "bg";

export type StyleKey =
	| "bold"
	| "dim"
	| "italic"
	| "underline"
	| "inverse"
	| "hidden"
	| "strikethrough"
	| "doubleUnderline"
	| "frame"
	| "encircle"
	| "overline";

export type ChainKey = ColorKey | StyleKey;

export type Chain<Keys extends ChainKey> = Color<Keys> & Style<Keys>;

export type ChainBuilder = <Keys extends ChainKey>(
	keys       : ReadonlySet<Keys>,
	baseFormat : FormatBase,
) => Chain<Keys>;

export type Code = number | number[];

export interface FormatBase {
	(text: string): string;

	open  : string;
	close : string;
	codes : {open: Code, close: Code};
}

export interface ChainedFormat<Keys extends ChainKey = ChainKey> extends FormatBase {
	and: Chain<Keys>;
}

export type Format<Keys extends ChainKey = ChainKey> =
	[Keys] extends [never] ? FormatBase : ChainedFormat<Keys>;

export type FormatBuilder = <Keys extends ChainKey = ChainKey>(
	keys   : ReadonlySet<Keys>,
	open   : Code,
	close  : Code,
	reset? : boolean,
) => Format<Keys>;

export interface Channel<Keys extends ChainKey = ChainKey> {
	black   : Format<Keys>;
	red     : Format<Keys>;
	green   : Format<Keys>;
	yellow  : Format<Keys>;
	blue    : Format<Keys>;
	magenta : Format<Keys>;
	cyan    : Format<Keys>;
	white   : Format<Keys>;

	brightBlack   : Format<Keys>;
	brightRed     : Format<Keys>;
	brightGreen   : Format<Keys>;
	brightYellow  : Format<Keys>;
	brightBlue    : Format<Keys>;
	brightMagenta : Format<Keys>;
	brightCyan    : Format<Keys>;
	brightWhite   : Format<Keys>;

	rgb: (r: number, g: number, b: number) => Format<Keys>;

	x256: {
		(code: number): Format<Keys>;
		(r: number, g: number, b: number): Format<Keys>;
	};

	default: string,
}

export type Color<Keys extends ChainKey = ChainKey> = {
	[K in Extract<ColorKey, Keys>]: Channel<Exclude<Keys, K>>;
};

export type Style<Keys extends ChainKey = ChainKey> = {
	[K in Extract<StyleKey, Keys>]: Format<Exclude<Keys, K>>;
};

export interface SGR {
	fg    : Channel<Exclude<ChainKey, "fg">>;
	bg    : Channel<Exclude<ChainKey, "bg">>;
	style : Style;
	reset : string;
}