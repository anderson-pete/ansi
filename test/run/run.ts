import ansi                  from "@peteanderson/ansi";
import {spawnSync}           from "node:child_process";
import Path                  from "node:path";
import {diff}                from "./diff";
import {execute, executions} from "./exec";
import {formatExec}          from "./format";

export function run(): void {
	process.chdir(Path.resolve(__dirname, ".."));

	for (const exec of executions) {
		console.log(`${ansi.fg.green("diff")} ${formatExec(true, exec)}`);

		const left  = execute(exec[0]);
		const right = execute(exec[1]);

		if (left === right)
			continue;

		diff.sideBySide(left.split("\n"), right.split("\n"));
		process.exit(1);
	}

	console.log(`\n${ansi.fg.green("tsx")} test.ts`);
	spawnSync("tsx", ["test.ts"], {stdio: "inherit"});
}