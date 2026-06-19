import {visibleLength} from "./strip";

/**
 * Pad the given text at the end with the specified fill string to the target visible length without
 * counting ANSI escape codes.
 */
export const padEnd = (text: string, targetLength: number, fillString = " "): string =>
	text + fillString.repeat(Math.max(0, targetLength - visibleLength(text)) / fillString.length);

/**
 * Pad the given text at the start with the specified fill string to the target visible length
 * without counting ANSI escape codes.
 */
export const padStart = (text: string, targetLength: number, fillString = " "): string =>
	fillString.repeat(Math.max(0, targetLength - visibleLength(text)) / fillString.length) + text;