import ansi, {ansi as defaultInstance, disabled, makeAnsi} from "../src";

import type {Ansi, FormatBase} from "../src";

// Test type checking.
const green  : FormatBase = ansi.fg.green;
const red    : FormatBase = ansi.fg.red;
const yellow : FormatBase = ansi.fg.yellow;

const expect = (expected: unknown, actual: unknown) =>
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

type Args = Parameters<typeof ansi>;

const format = (ansi: Ansi) => ansi.fg.rgb(255, 128, 64)("Hello, world!");

console.log("default          :", format(ansi));

const force = (...args: Args) => format(ansi(...args));

const formatValue = (val: unknown): string =>
	val === undefined        ? ansi.style.dim("undefined") :
	typeof val === "boolean" ? ansi.fg.brightBlue(String(val)) :
	typeof val === "number"  ? ansi.fg.brightRed(String(val)) :
	String(val);

for (const arg of ([undefined, true, 24, 8, 4, 3, 1, false] as const))
	console.log(`force(${ansi.padStart(formatValue(arg), 9)}) :`, force(arg));

console.log("disabled         :", format(disabled));