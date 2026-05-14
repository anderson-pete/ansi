"use strict";

/** @typedef {import("./types").BuildAtom} BuildAtom */

/** @type {BuildAtom} */
function buildExtendedColorAtom(attribute, codes, index) {
	switch (codes[index + 1]) {
		case 2:
			if (index + 5 >= codes.length)
				return {attribute, code: codes.slice(index), skip: codes.length - index - 1};
			return {attribute, code: codes.slice(index, index + 5), skip: 4};
		case 5:
			if (index + 3 >= codes.length)
				return {attribute, code: codes.slice(index), skip: codes.length - index - 1};
			return {attribute, code: codes.slice(index, index + 3), skip: 2};
		default:
			return {attribute, code: codes.slice(index, index + 2), skip: 1};
	}
}

/** @type {BuildAtom} */
function buildIntensityAtom(attribute, codes, index, state) {
	const code = codes[index];
	if (code === 22)
		return {attribute, code: [code]};

	const current = state.get("intensity");
	if (!current || current.length == 1 && current[0] === code || current[0] === 22)
		return {attribute, code: [code]};

	return {attribute, code: [1, 2]};
}

module.exports = {buildExtendedColorAtom, buildIntensityAtom};