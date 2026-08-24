import {diff}       from "../diff";
import {alignLines} from "./align";
import * as output  from "./output";

import type {Context} from "./types";

const longest = (lines: readonly string[]): Context["longest"]["left"] => ({
	line   : Math.max(...lines.map(line => line.length)),
	number : (Math.log10(lines.length) | 0) + 1,
});

export function sideBySide(left: readonly string[], right: readonly string[]): void {
	const ctx: Context = {
		longest    : {left: longest(left), right: longest(right)},
		leftIndex  : 0,
		rightIndex : 0,
	};

	const segments = diff(left, right);

	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];

		switch (segment.type) {
		case "equal":
			for (const line of segment) {
				output.sameLine(ctx, line);
				ctx.leftIndex++;
				ctx.rightIndex++;
			}
			break;
		case "insert":
			for (const line of segment) {
				output.insertedLine(ctx, line);
				ctx.rightIndex++;
			}
			break;
		case "delete":
			if (segments[i + 1]?.type === "insert") {
				const deleted  = segment;
				const inserted = segments[++i];
				for (const {left, right, diffs} of alignLines(deleted, inserted)) {
					if (left === undefined) {
						const rightIndex = ctx.rightIndex + right!;
						output.insertedLine({...ctx, rightIndex}, inserted[right!]);
					} else if (right === undefined) {
						const leftIndex = ctx.leftIndex + left!;
						output.deletedLine({...ctx, leftIndex}, deleted[left!]);
					} else {
						const leftIndex  = ctx.leftIndex  + left;
						const rightIndex = ctx.rightIndex + right;
						output.changedLine({...ctx, leftIndex, rightIndex}, diffs!);
					}
				}
				ctx.leftIndex  += deleted.length;
				ctx.rightIndex += inserted.length;
			} else {
				for (const line of segment) {
					output.deletedLine(ctx, line);
					ctx.leftIndex++;
				}
			}
			break;
		}
	}
}