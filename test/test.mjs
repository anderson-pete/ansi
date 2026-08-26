import ansi, {ansi as defaultInstance, disabled, makeAnsi, padEnd} from "@peteanderson/ansi";

/** @import {Ansi, FormatBase} from "@peteanderson/ansi" */
/** @typedef {Parameters<typeof ansi>} Args */

// Test type checking.
/** @type {FormatBase} */
const green = ansi.fg.green;
/** @type {FormatBase} */
const red = ansi.fg.red;
/** @type {FormatBase} */
const yellow = ansi.fg.yellow;

/** @type {(tests: Record<string, [expected: unknown, actual: unknown]>) => void } */
function expectAll(tests) {
	const descriptionWidth = Math.max(...Object.keys(tests).map(key => key.length));

	/** @type {(description: string, actual: unknown) => string} */
	const pass = (description, actual) =>
		`${description.padEnd(descriptionWidth)} : ${green(String(actual))}`;

	/** @type {(description: string, expected: unknown, actual: unknown) => string} */
	const fail = (description, expected, actual) =>
		`${padEnd(red(description), descriptionWidth)} : ` +
		`${red(String(actual))} (expected: ${yellow(String(expected))})`

	for (const [description, [expected, actual]] of Object.entries(tests)) {
		console.log(
			expected === actual ? pass(description, actual) : fail(description, expected, actual),
		);
	}
}

const chain    = ansi.chain(green);
const blue     = ansi.fg.blue;
const dimGreen = ansi.fg.green.and.dim;

expectAll({
	"makeAnsi.name"                : ["makeAnsi",       makeAnsi.name], // @ts-expect-error (next line)
	"defaultInstance.name"         : [undefined,        defaultInstance.name],
	"ansi.name"                    : ["ansi",           ansi.name], // @ts-expect-error
	"typeof makeAnsi.fg"           : ["undefined",      typeof makeAnsi.fg],
	"typeof defaultInstance.fg"    : ["object",         typeof defaultInstance.fg],
	"typeof ansi.fg"               : ["object",         typeof ansi.fg], // @ts-expect-error
	"makeAnsi === defaultInstance" : [false,            makeAnsi === defaultInstance],
	"makeAnsi === ansi"            : [false,            makeAnsi === ansi],
	"defaultInstance === ansi"     : [false,            defaultInstance === ansi],
	"typeof makeAnsi"              : ["function",       typeof makeAnsi],
	"typeof defaultInstance"       : ["object",         typeof defaultInstance],
	"typeof ansi"                  : ["function",       typeof ansi],
	"chain.and.fg.green"           : ["function",       typeof chain.and.fg.green],
	"chain.and.dim"                : ["function",       typeof chain.and.dim],
	'chain("text")'                : [green("text"),    chain("text")],
	'chain.and.fg.blue("text")'    : [blue("text"),     chain.and.fg.blue("text")],
	'chain.and.dim("text")'        : [dimGreen("text"), chain.and.dim("text")],
});
console.log();

/** @type {(ansi: Ansi) => string} */
const format = ansi => ansi.fg.rgb(255, 128, 64)("Hello, world!");

console.log("default          :", format(ansi));

/** @type {(...args: Args) => string} */
const force = (...args) => format(ansi(...args));

/** @type {(val: unknown) => string} */
const formatValue = val =>
	val === undefined        ? ansi.style.dim("undefined") :
	typeof val === "boolean" ? ansi.fg.brightBlue(String(val)) :
	typeof val === "number"  ? ansi.fg.brightRed(String(val)) :
	String(val);

for (const arg of /** @type {const} */([undefined, true, 24, 8, 4, 3, 1, false]))
	console.log(`force(${ansi.padStart(formatValue(arg), 9)}) :`, force(arg));

console.log("disabled         :", format(disabled));