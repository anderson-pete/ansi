import fs          from "node:fs";
import {spawnSync} from "node:child_process";
import Path        from "node:path";

const spawn    = (command: string, ...args: string[]) => spawnSync(command, args, {stdio: "inherit"});
const tsc      = spawn.bind(undefined, "tsc");
const tscAlias = spawn.bind(undefined, "tsc-alias");

function buildESM() {
	console.log("Building ESM ...");
	console.log();

	tsc("-p", "tsconfig.esm.json");

	tscAlias(
		"-p",                   "tsconfig.esm.json",
		"--inputglob",          "js",
		"--resolve-full-paths",
		"--verbose",
	);

	fs.writeFileSync("dist/esm/package.json", '{"type":"module"}');
}

function buildCJS() {
	console.log("Building CJS ...");
	console.log();

	tsc("-p", "tsconfig.cjs.json");

	for (const file of fs.readdirSync("dist/cjs")) {
		if (file.startsWith("require")) {
			const src  = Path.join("dist/cjs", file);
			const dest = Path.join("dist/cjs", file.replace("require", "index"));
			fs.renameSync(src, dest);
			if (file.endsWith(".map")) {
				const map = JSON.parse(fs.readFileSync(dest, "utf8"));
				map.file = map.file.replace("require", "index");
				fs.writeFileSync(dest, JSON.stringify(map));
			} else {
				let   contents = fs.readFileSync(dest, "utf8");
				const i        = contents.indexOf("sourceMappingURL=require.");

				if (i >= 0) {
					contents = `${
						contents.slice(0, i + "sourceMappingURL=".length)
					}index.${
						contents.slice(i + "sourceMappingURL=require.".length)
					}`;

					fs.writeFileSync(dest, contents);
				}
			}
		}
	}
}

buildESM();
console.log();
buildCJS();