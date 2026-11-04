import {define} from "@peteanderson/props";
import {lazy}   from "../lazy";

import type {FormatFamily}              from "./family";
import type {ChainedFormat, FormatBase} from "./types";

/**
 * Turns an existing function into an instance of whichever class `new` is applied to, by setting
 * its prototype. (The function is returned from the constructor, so `new` yields the function
 * itself, and any private fields declared by subclasses are installed on it.)
 */
class Callable {
	constructor(fn: (text: string) => string) {
		return Object.setPrototypeOf(fn, new.target.prototype);
	}
}

Object.setPrototypeOf(Callable.prototype, Function.prototype);

/**
 * Gets the family a format belongs to, if it was made by one. This is a module-level function,
 * assigned from inside `Formatter` where the private field is in scope, rather than a member of the
 * class, because members of the class can be reached through the formats themselves.
 */
export let getFamily!: (format: object) => FormatFamily<any> | undefined;

export interface Formatter extends FormatBase {}

/**
 * A format: a function that wraps text in a particular set of codes. The properties shared by all
 * formats are inherited from here rather than being defined on each one, and the state shared by
 * the formats in the same family is reached through a private link to that family.
 *
 * Instances must be made by a `FormatFamily`, which also assigns `open`, `close`, and `codes`.
 */
export class Formatter extends Callable {
	readonly #family: FormatFamily<any>;

	constructor(fn: (text: string) => string, family: FormatFamily<any>) {
		super(fn);
		this.#family = family;
	}

	static {
		getFamily = format => #family in format ? (format as Formatter).#family : undefined;

		define(this.prototype, "combine", lazy("combine", function(this: Formatter) {
			return getFamily(this)!.makeCombine(this);
		}));
	}
}

export interface ChainedFormatter extends ChainedFormat {}

/** A format that can be chained with `.and`. */
export class ChainedFormatter extends Formatter {
	static {
		define(this.prototype, "and", lazy("and", function(this: ChainedFormatter) {
			return getFamily(this)!.makeChain(this);
		}));
	}
}