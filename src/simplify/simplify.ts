import {rxSGR} from "../patterns";
import {State} from "./state";

export function simplify(text: string): string {
	// `.split` doesn't modify `lastIndex`, so no clone is necessary here.
	const parts = text.split(rxSGR);

	const state  = new State();
	let   result = parts[0];

	for (let i = 1; i < parts.length; ) {
		let codes = parts[i++].split(";").map(Number);
		let chunk = parts[i++];

		while (!chunk && i < parts.length) {
			// Merge consecutive SGR sequences with no text between them.
			codes.push(...parts[i++].split(";").map(Number));
			chunk = parts[i++];
		}

		const newCodes = state.update(codes);
		if (newCodes.length)
			result += `\x1b[${newCodes.join(";")}m`;
		result += chunk;
	}

	return result;
}

export type Simplify = typeof simplify;