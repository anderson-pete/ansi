import * as $ansi from "./ansi";

declare namespace ansi {
	export type Ansi = import("./types").Ansi;
}

const {default: $default, ...$named} = $ansi;

const ansi = Object.assign($default, $named);

export = ansi;