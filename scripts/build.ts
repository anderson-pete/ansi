import fs          from "node:fs";
import {spawnSync} from "node:child_process";
import Path        from "node:path";

const spawn    = (command: string, ...args: string[]) => spawnSync(command, args, {stdio: "inherit"});
const tsc      = spawn.bind(undefined, "tsc");
const tscAlias = spawn.bind(undefined, "tsc-alias");

const {imports} = JSON.parse(fs.readFileSync("package.json", "utf8"));
for (const key of Object.keys(imports)) {
	const path = imports[key].replace("./src/", "./");
	imports[key] = {
		types   : path.replace(".ts", ".d.ts"),
		default : path.replace(".ts", ".js"),
	};
}

const writePackageJson = (build: "esm" | "cjs") => fs.writeFileSync(
	Path.join("dist", build, "package.json"),
	JSON.stringify({type: build === "esm" ? "module" : "commonjs", imports}, undefined, "\t"),
);

function buildESM() {
	console.log("Building ESM ...");
	console.log();

	tsc("-p", "tsconfig.esm.json");

	tscAlias("-p", "tsconfig.esm.json", "--resolve-full-paths", "--verbose");

	writePackageJson("esm");
}

function buildCJS() {
	console.log("Building CJS ...");
	console.log();

	tsc("-p", "tsconfig.cjs.json");

	writePackageJson("cjs");

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