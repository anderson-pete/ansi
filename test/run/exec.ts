import {execFileSync} from "node:child_process";

export interface ExecInfo {
	color   : string;
	command : string;
	file    : string;
}

const files = "cj,ct,mj,mt,t".split(",").map(s => `test.${s}s`);

const execInfo = (color: string, file: string) => ({
	color,
	command: file.endsWith("js") ? "node" : "tsx",
	file
});

export const executions = ["", ..."0123"].flatMap(color => {
	const execInfos = files.map(file => execInfo(color, file));
	return execInfos.flatMap((left, i) =>
		execInfos.slice(i + 1).map(right => [left, right] as const),
	);
});

/** @type {(exec: ExecInfo) => string} */
export const execute = (exec: ExecInfo): string => execFileSync(exec.command, [exec.file], {
	encoding : "utf-8",
	env      : {...process.env, FORCE_COLOR: exec.color},
});