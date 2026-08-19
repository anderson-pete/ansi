import * as $ansi from "./ansi";

declare namespace ansi {
	export type Ansi       = import("./types").Ansi;
	export type ChainKey   = import("./sgr/types").ChainKey;
	export type Format     = import("./sgr/types").Format;
	export type FormatBase = import("./sgr/types").FormatBase;
}

const {default: $default, ...$named} = $ansi;

const ansi = Object.assign($default, $named);

export = ansi;