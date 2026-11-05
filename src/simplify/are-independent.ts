import {getAttribute}  from "./lookup";
import {defaultCodes} from "./state";

import type {CodeArray} from "./types";

const bits = new Map(
	[...defaultCodes.keys()].map((attribute, i) => [attribute, 1 << i] as const),
);

const allBits = (1 << bits.size) - 1;

/**
 * Determines whether all of the codes set different attributes, with nothing resetting or otherwise
 * interfering with anything else. If so, there's nothing to simplify, because the result of
 * simplifying them (starting from nothing) is just the codes themselves.
 *
 * It gives up as soon as anything repeats or isn't recognized, and since there are only so many
 * attributes, that happens after a handful of codes, however many there are.
 */
export function areIndependent(codes: CodeArray): boolean {
	let seen = 0;

	for (let i = 0; i < codes.length; i++) {
		const code = codes[i];
		const bit  = bits.get(getAttribute(code));

		if (!bit || seen & bit)
			return false;

		seen |= bit;

		// An extended color goes with the codes after it. (If there aren't enough of them, it takes
		// whatever's left, which ends the loop.)
		if (code === 38 || code === 48) {
			switch (codes[i + 1]) {
				case 2  : i += 4; break;
				case 5  : i += 2; break;
				default : i += 1;
			}
		}
	}

	// If every attribute has been set, they might all be at their defaults, which is just a reset.
	return seen !== allBits;
}