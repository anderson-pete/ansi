import ansi          from "@peteanderson/ansi";
import {LineBuilder} from "./line-builder";

import type {DiffSegment} from "../types";
import type {Context}     from "./types";

const {fg: {brightGreen: green, red}, padEnd, padStart, style: {dim, bold}} = ansi;

const leftHighlight  = dim.and.underline;
const rightHighlight = bold.and.underline;

function lineNumbers(ctx: Context, left?: string, right?: string): [string, string] {
	const leftLength  = ctx.longest.left.number;
	const rightLength = ctx.longest.right.number;

	if (left === undefined)
		return [" ".repeat(leftLength), padStart(green(String(ctx.rightIndex + 1)), rightLength)];

	if (right === undefined)
		return [padStart(red(String(ctx.leftIndex + 1)), leftLength), " ".repeat(rightLength)];

	const [leftStyle, rightStyle] = left === right ? [dim, dim] : [red, green];

	return [
		padStart(leftStyle(String(ctx.leftIndex + 1)), leftLength),
		padStart(rightStyle(String(ctx.rightIndex + 1)), rightLength)
	]
}

function outputLine(ctx: Context, left?: string, right?: string): void {
	const [leftLineNumber, rightLineNumber] = lineNumbers(ctx, left, right);
	console.log(" " + [
		leftLineNumber,
		padEnd(left ?? "", ctx.longest.left.line),
		rightLineNumber,
		right ?? "",
	].join(` ${dim("│")} `));
}

export const sameLine     = (ctx: Context, line: string) => outputLine(ctx, line, line);
export const deletedLine  = (ctx: Context, line: string) => outputLine(ctx, leftHighlight(line));
export const insertedLine = (ctx: Context, line: string) => outputLine(ctx, undefined, rightHighlight(line));

export function changedLine(ctx: Context, diffs: readonly DiffSegment[]): void {
	const left  = new LineBuilder(leftHighlight);
	const right = new LineBuilder(rightHighlight);

	for (let i = 0; i < diffs.length; i++) {
		const segment = diffs[i];
		const text    = segment.join("");
		switch (segment.type) {
		case "equal":
			left.push(text);
			right.push(text);
			break;
		case "delete":
			left.push(leftHighlight(text));
			if (segment.every(char => /\x1b\[[0-9;]*m/.test(char)))
				left.appending = true;
			break;
		case "insert":
			right.push(rightHighlight(text));
			if (segment.every(char => /\x1b\[[0-9;]*m/.test(char)))
				right.appending = true;
			break;
		}
	}

	outputLine(ctx, left.toString(), right.toString());
}