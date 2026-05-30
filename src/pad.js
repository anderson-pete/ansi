"use strict";

const {visibleLength} = require("./strip");

/**
 * Pad the given text at the end with the specified fill string to the target visible length without
 * counting ANSI escape codes.
 * @type {(text: string, targetLength: number, fillString?: string) => string}
 */
const padEnd = (text, targetLength, fillString = " ") =>
	text + fillString.repeat(Math.max(0, targetLength - visibleLength(text)) / fillString.length);

/**
 * Pad the given text at the start with the specified fill string to the target visible length
 * without counting ANSI escape codes.
 * @type {(text: string, targetLength: number, fillString?: string) => string}
 */
const padStart = (text, targetLength, fillString = " ") =>
	fillString.repeat(Math.max(0, targetLength - visibleLength(text)) / fillString.length) + text;

module.exports = {padEnd, padStart};