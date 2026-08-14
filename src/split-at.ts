import {scanCSI, skippedSequences} from "./slice";

import type {slice} from "./slice";

/**
 * Split a string into two parts at the given visible index (i.e., the given visible character,
 * ignoring ANSI escape codes). The returned strings will include any ANSI escape codes from within
 * each slice.
 *
 * Note that unlike {@linkcode slice}, this function doesn't, by default include any SGR codes (m)
 * from before or after the split point. If you need to preserve the terminal state before and after
* the split, pass `true` for the `includeSkipped` parameter.
 */
export function splitAt(
	text           : string,
	visibleIndex   : number,
	includeSkipped : boolean = false,
): [start: string, end: string] {
	if (!visibleIndex)
		return ["", text];

	if (visibleIndex < 0)
		throw new Error("visibleIndex must be non-negative");

	if (visibleIndex > text.length)
		return [text, ""];

	const {index} = scanCSI(text, 0, visibleIndex);

	if (index === text.length)
		return [text, ""];

	let start = text.slice(0, index);
	let end   = text.slice(index);

	if (includeSkipped) {
		start += skippedSequences(text, index);
		end    = skippedSequences(text, 0, index) + end;
	}

	return [start, end];
}

export type SplitAt = typeof splitAt;