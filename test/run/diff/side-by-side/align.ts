import {diff} from "../diff";

import type {DiffSegment} from "../types";
import type {AlignedLine} from "./types";

interface Similarity {
	equal : number;
	score : number;
}

function measureSimilarity(segments: readonly DiffSegment[]): Similarity {
	let equal     = 0;
	let different = 0;

	for (const segment of segments) {
		if (segment.type === "equal")
			equal += segment.length;
		else
			different += segment.length;
	}

	const total = 2 * equal + different;
	return {equal, score: total ? 2 * equal / total : 1};
}

const scoreThreshold  = 0.5;
const lengthThreshold = 3;
const weight = ({score, equal}: Similarity): number =>
	score >= scoreThreshold && equal >= lengthThreshold
		? score - scoreThreshold
		: Number.NEGATIVE_INFINITY;

// Consider ANSI SGR sequences to be single characters for the purposes of diffing.
const splitCharacters = (line: string): string[] => line.match(/\x1b\[[\d;]*m|./g) ?? [];

export function *alignLines(deleted: DiffSegment, inserted: DiffSegment): Generator<AlignedLine> {
	const comparisons = deleted.map(left => inserted.map(right => {
		const segments = diff(splitCharacters(left), splitCharacters(right));
		return {segments, ...measureSimilarity(segments)};
	}));

	const best = Array.from({length: deleted.length + 1}, () =>
		new Float64Array(inserted.length + 1)
	);

	for (let dIndex = deleted.length - 1; dIndex >= 0; dIndex--) {
		for (let iIndex = inserted.length - 1; iIndex >= 0; iIndex--) {
			best[dIndex][iIndex] = Math.max(
				best[dIndex + 1][iIndex],
				best[dIndex][iIndex + 1],
				weight(comparisons[dIndex][iIndex]) + best[dIndex + 1][iIndex + 1],
			);
		}
	}

	for (let dIndex = 0, iIndex = 0; dIndex < deleted.length || iIndex < inserted.length;) {
		if (dIndex === deleted.length) {
			do {
				yield {right: iIndex};
			} while (++iIndex < inserted.length);
			break;
		}

		if (iIndex === inserted.length) {
			do {
				yield {left: dIndex};
			} while (++dIndex < deleted.length);
			break;
		}

		const changed  = weight(comparisons[dIndex][iIndex]) + best[dIndex + 1][iIndex + 1];
		const deletion = best[dIndex + 1][iIndex];
		const current  = best[dIndex][iIndex];

		if (current === changed)
			yield {left: dIndex, right: iIndex, diffs: comparisons[dIndex++][iIndex++].segments};
		else if (current === deletion)
			yield {left: dIndex++};
		else
			yield {right: iIndex++};
	}
}