import * as $ansi from "./ansi";

declare namespace ansi {
	export type Ansi       = import("./types").Ansi;
	export type ChainKey   = import("./sgr").ChainKey;
	export type Format     = import("./sgr").Format;
	export type FormatBase = import("./sgr").FormatBase;
}

const {default: $default, ...$named} = $ansi;

const ansi = Object.assign($default, $named);

export = ansi;