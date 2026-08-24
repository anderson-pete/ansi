import ansi         from "@peteanderson/ansi";
import {executions} from "./exec";

import type {ExecInfo} from "./exec";

/** @type {(key: keyof ExecInfo) => [left: number, right: number]} */
const maxOf = (key: keyof ExecInfo): [left: number, right: number] => executions.reduce(
	([lmax, rmax], [l, r]) => [Math.max(lmax, l[key].length), Math.max(rmax, r[key].length)],
	[0, 0],
);

const max = Object.fromEntries((["color", "command", "file"] as const).map(k => [k, maxOf(k)]));

export function formatExec(color: boolean, exec: readonly [ExecInfo, ExecInfo]): string {
	const {fg: {green, magenta}} = color ? ansi.ansi : ansi.disabled;
	return exec.map(({color, command, file}, index) =>
		magenta("<(") +
		`FORCE_COLOR=${color.padEnd(max.color[index])} ` +
		ansi.padEnd(green(command), max.command[index]) + " " +
		ansi.padEnd(file, max.file[index]) +
		magenta(")")
	).join(" ");
}