import {rxCSI, rxSGR}  from "./patterns";
import {simplify}      from "./simplify";
import {visibleLength} from "./strip";

function scanCSI(
	text            : string,
	fromStringIndex : number,
	visibleCount    : number,
): {index: number; length: number} {
	// We intentionally mutate `lastIndex` here, so we need a clone.
	const rx = new RegExp(rxCSI);

	let length = 0;
	let index  = fromStringIndex;

	while (index < text.length && length < visibleCount) {
		if (text[index] === "\x1b") {
			rx.lastIndex = index;
			const match = rx.exec(text);
			if (match?.index === index) {
				index += match[0].length;
				continue;
			}
		}

		index++;
		length++;
	}

	return {index, length};
}

function skippedSequences(text: string, start: number, end?: number): string {
	const sequences = text.slice(start, end).match(new RegExp(rxSGR));
	return sequences ? simplify(sequences.join("")) : "";
}

/**
 * Return a slice of the given text, counting only visible characters (i.e. ignoring ANSI escape
 * codes). The returned slice will include any ANSI escape codes from within the slice. In addition,
 * SGR codes (m) from before and after the slice will be combined, simplified, and included so that
 * the terminal state before and after the slice will be the same as if the whole string were
 * printed. If you compose two or more slices together, there may be redundant SGR sequences at the
 * boundaries, but the result will be correct. You can use `simplify` to remove the redundancies.
 *
 * Note the following caveats:
 *
 *   * Any non-SGR ANSI codes prior to or after the slice will be ignored.
 *   * Control characters (such as newlines and backspaces) both outside and inside the slice are
 *     counted as visible characters.
 *
 * These caveats mean that text may not appear on screen to be the same number of characters as the
 * length of the slice, and that the terminal state may not be exactly the same at the start and end
 * of the slice as it would be if the whole string were printed. This function is intended mostly
 * for text that contains SGR codes, but no other ANSI codes or control characters.
 */
export function slice(text: string, start: number, end: number): string {
	let textVisibleLength: number | undefined;
	const getVisibleLength = () => textVisibleLength ??= visibleLength(text);

	if (start < 0 || end < 0) {
		textVisibleLength = getVisibleLength();
		if (start < 0)
			start = Math.max(0, textVisibleLength + start);
		if (end < 0)
			end = Math.max(0, textVisibleLength + end);
	}
	if (start > end)
		return "";

	if (start === 0 && (end >= text.length || end >= getVisibleLength()))
		return text;

	const {index: startIndex, length: visibleSkipped} = scanCSI(text, 0, start);

	const endIndex =
		startIndex < text.length && visibleSkipped < end
			? scanCSI(text, startIndex, end - visibleSkipped).index
			: text.length;

	// Start and end the string in the same terminal state it would be in if the string weren't sliced.
	const leadingSequences  = skippedSequences(text, 0, startIndex);
	const trailingSequences = skippedSequences(text, endIndex);

	return leadingSequences + text.slice(startIndex, endIndex) + trailingSequences;
}

export type Slice = typeof slice;