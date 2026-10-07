import * as $ansi from "./ansi";

declare namespace ansi {
	export type Ansi                                      = import("./types").Ansi;
	export type ChainKey                                  = import("./sgr").ChainKey;
	export type Channel<Keys extends ChainKey = ChainKey> = import("./sgr").Channel<Keys>;
	export type Format<Keys extends ChainKey = ChainKey>  = import("./sgr").Format<Keys>;
	export type FormatBase                                = import("./sgr").FormatBase;
}

const {default: $default, ...$named} = $ansi;

const ansi = Object.assign($default, $named);

export = ansi;