import {areIndependent} from "../simplify/are-independent";
import {State}          from "../simplify/state";

import type {Code} from "#code";

function append(into: Array<number | "">, code: Code): void {
	if (!Array.isArray(code)) {
		into.push(code);
		return;
	}

	for (let i = 0; i < code.length; i++)
		into.push(code[i]);
}

export function combineCodes(base: Code, ...codes: Code[]): Code {
	const flat: Array<number | ""> = [];

	append(flat, base);

	for (let i = 0; i < codes.length; i++)
		append(flat, codes[i]);

	// Simplifying is only necessary if the codes affect each other.
	return areIndependent(flat) ? flat : new State().update(flat);
}