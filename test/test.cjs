const ansi = require("@peteanderson/ansi");

const {ansi: defaultInstance, disabled, makeAnsi} = ansi;

/** @import {Ansi, FormatBase} from "@peteanderson/ansi" */
/** @typedef {Parameters<typeof ansi>} Args */

// Test type checking.
/** @type {FormatBase} */
const green = ansi.fg.green;
/** @type {FormatBase} */
const red = ansi.fg.red;
/** @type {FormatBase} */
const yellow = ansi.fg.yellow;

/** @type {(expected: unknown, actual: unknown) => string} */
const expect = (expected, actual) =>
	expected === actual
		? green(String(actual))
		: `${red(String(actual))} (expected: ${yellow(String(expected))})`;

console.log("makeAnsi.name                :", expect("makeAnsi", makeAnsi.name));
// @ts-expect-error
console.log("defaultInstance.name         :", expect(undefined, defaultInstance.name));
console.log("ansi.name                    :", expect("ansi", ansi.name));
// @ts-expect-error
console.log("typeof makeAnsi.fg           :", expect("undefined", typeof makeAnsi.fg));
console.log("typeof defaultInstance.fg    :", expect("object", typeof defaultInstance.fg));
console.log("typeof ansi.fg               :", expect("object", typeof ansi.fg));
// @ts-expect-error
console.log("makeAnsi === defaultInstance :", expect(false, makeAnsi === defaultInstance));
console.log("makeAnsi === ansi            :", expect(false, makeAnsi === ansi));
console.log("defaultInstance === ansi     :", expect(false, defaultInstance === ansi));
console.log("typeof makeAnsi              :", expect("function", typeof makeAnsi));
console.log("typeof defaultInstance       :", expect("object", typeof defaultInstance));
console.log("typeof ansi                  :", expect("function", typeof ansi));
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