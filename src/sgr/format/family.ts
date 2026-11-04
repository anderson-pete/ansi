import {csi}                         from "#utils";
import {makeChain}                   from "../chain/build";
import {combineCodes}                from "../combine";
import {ChainedFormatter, Formatter} from "./formatter";
import {makeFormatFunction}          from "./format-function";

import type {Code}               from "#code";
import type {Chain, ChainKey}    from "../chain";
import type {FormatContext}      from "../context";
import type {Format, FormatBase} from "./types";

/**
 * A family of formats that differ only in their open code. Everything else about them is the same,
 * so it's worked out once here: the close code, the core of the format function, and the class the
 * formats are made from.
 */
export class FormatFamily<Keys extends ChainKey = ChainKey> {
	readonly context       : FormatContext<Keys>;
	readonly reset         : boolean | undefined;
	readonly close         : Code;
	readonly closeSequence : string;

	readonly #makeFunction : ReturnType<typeof makeFormatFunction>;
	readonly #class        : typeof Formatter;

	constructor(context: FormatContext<Keys>, close: Code, reset?: boolean) {
		this.context       = context;
		this.reset         = reset;
		this.close         = context.parentCodes
			? combineCodes(close, context.parentCodes.close)
			: close;
		this.closeSequence = csi(this.close, "m");

		this.#makeFunction = makeFormatFunction(this.close, this.closeSequence, reset);
		this.#class        = context.keys.size ? ChainedFormatter : Formatter;
	}

	make(open: Code): Format<Keys> {
		const {context} = this;

		if (context.parentCodes)
			open = combineCodes(context.parentCodes.open, open);

		const openSequence = csi(open, "m");
		const format       = new this.#class(
			openSequence ? this.#makeFunction(open, openSequence) : (text: string) => text,
			this,
		);

		format.open  = openSequence;
		format.close = this.closeSequence;
		format.codes = {open, close: this.close};

		return format as unknown as Format<Keys>;
	}

	/**
	 * Makes a copy of a format in this family. The copy calls the original, so it behaves
	 * identically (including how it re-opens after nested formats), and it's linked to this
	 * family, so it knows its context. It's never a `ChainedFormatter`, because `chain` attaches
	 * its own `and`.
	 */
	makeClone(format: FormatBase): FormatBase {
		const clone = new Formatter((text: string) => format(text), this);

		clone.open  = format.open;
		clone.close = format.close;
		clone.codes = format.codes;

		return clone;
	}

	/** Makes the `combine` property of a format in this family. */
	makeCombine(format: FormatBase): FormatBase["combine"] {
		const {open, close} = format.codes;

		return (...formats) => makeFormat(
			this.context,
			combineCodes(open,  ...formats.map(f => f.codes.open)),
			combineCodes(close, ...formats.map(f => f.codes.close)),
			this.reset,
		);
	}

	/** Makes the `and` property of a format in this family. */
	makeChain(format: FormatBase): Chain<Keys> {
		return makeChain(this.context, format);
	}
}

/** Makes a single format. */
export const makeFormat = <Keys extends ChainKey = ChainKey>(
	context : FormatContext<Keys>,
	open    : Code,
	close   : Code,
	reset?  : boolean,
): Format<Keys> => new FormatFamily(context, close, reset).make(open);