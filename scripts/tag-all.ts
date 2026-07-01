import {execFileSync} from "node:child_process";

const git = (...args: string[]): string => execFileSync("git", args, {encoding: "utf8"}).trim();

export function tagAll(): void {
	const commits = git("log", "--reverse", "--format=%h", "-G", '"version"\\s*:', "package.json")
		.split("\n");

	let previousVersion: string | undefined;

	for (const commit of commits) {
		const version = JSON.parse(git("show", `${commit}:package.json`)).version;

		if (version !== previousVersion) {
			const tag = `v${version}`;
			process.stdout.write(`Tagging ${commit} as ${tag} ... `);
			console.log(git("tag", "-fam", tag, tag, commit));
			previousVersion = version;
		}
	}
}

if (require.main === module) {
	try {
		tagAll();
	} catch (E) {
		console.error(E);
		process.exit(1);
	}
}