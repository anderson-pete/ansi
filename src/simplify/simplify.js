"use strict";

const {State} = require("./state");

const rxSGR = /\x1b\[([0-9;]+)m/;

/** @type {(text: string) => string} */
function simplify(text) {
	const parts = text.split(rxSGR);

	const state  = new State();
	let   result = parts[0];

	for (let i = 1; i < parts.length; ) {
		let codes = parts[i++].split(";").map(Number);
		let chunk = parts[i++];

		while (!chunk && i < parts.length) {
			// Merge consecutive SGR sequences.
			codes.push(...parts[i++].split(";").map(Number));
			chunk = parts[i++];
		}

		codes = state.update(codes);
		if (codes.length)
			result += `\x1b[${codes.join(";")}m`;
		result += chunk;
	}

	return result;
}

module.exports = {simplify};