import type {FormatContext} from "./context";

// Attaches a context to a format as a true private field, using the "return override" trick: `Base`
// returns whatever object it's given, so the subclass's constructor installs `#context` on that
// object instead of on a new instance. Unlike a symbol or string property, this needs no
// `defineProperty` call to hide it, so it's invisible to inspection, enumeration, spreading, and
// `getOwnPropertyDescriptors`. And unlike a `WeakMap`, it adds no GC bookkeeping.

class Base {
	constructor(object: object) { return object }
}

export class ContextTracker extends Base {
	#context: FormatContext<any>;

	constructor(format: object, context: FormatContext<any>) {
		super(format);
		this.#context = context;
	}

	static find(format: object): FormatContext<any> | undefined {
		return #context in format ? (format as ContextTracker).#context : undefined;
	}

	static track<T extends object>(format: T, context: FormatContext<any>): T {
		new ContextTracker(format, context);
		return format;
	}
}