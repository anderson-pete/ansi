import type {DiffSegment, DiffType} from "./types";

const diffSegment = (type: DiffType, firstElement: string): DiffSegment =>
	Object.assign([firstElement], {type});

/**
 * Compare two sequences of lines using their longest common subsequence.
 *
 * Consecutive operations of the same type are grouped into segments. A replacement is represented
 * by adjacent deletion and insertion segments; deciding how to present those is left to the caller.
 */
export function diff(left: readonly string[], right: readonly string[]): DiffSegment[] {
	const lengths = Array.from(
		{length: left.length + 1},
		() => new Uint32Array(right.length + 1),
	);

	for (let lIndex = left.length - 1; lIndex >= 0; lIndex--) {
		for (let rIndex = right.length - 1; rIndex >= 0; rIndex--) {
			lengths[lIndex][rIndex] = left[lIndex] === right[rIndex]
				? lengths[lIndex + 1][rIndex + 1] + 1
				: Math.max(lengths[lIndex + 1][rIndex], lengths[lIndex][rIndex + 1]);
		}
	}

	const segments: DiffSegment[] = [];
	function append(type: DiffType, line: string): void {
		const previous = segments.at(-1);

		if (previous?.type === type)
			previous.push(line);
		else
			segments.push(diffSegment(type, line));
	}

	let lIndex = 0;
	let rIndex = 0;
	while (lIndex < left.length && rIndex < right.length) {
		if (left[lIndex] === right[rIndex]) {
			append("equal", left[lIndex]);
			lIndex++;
			rIndex++;
		} else if (lengths[lIndex + 1][rIndex] >= lengths[lIndex][rIndex + 1])
			append("delete", left[lIndex++]);
		else
			append("insert", right[rIndex++]);
	}

	while (lIndex < left.length)
		append("delete", left[lIndex++]);
	while (rIndex < right.length)
		append("insert", right[rIndex++]);

	return segments;
}