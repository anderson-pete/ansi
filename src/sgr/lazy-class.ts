import {define} from "@peteanderson/props";
import {lazy}   from "./lazy";

export type LazyPropertyDefinition<State> = [key: string, makeValue: (state: State) => unknown];

let getState!: <State>(object: object) => State;

/** Holds the state that the lazy properties of its subclasses are made from. */
class LazyObject<State> {
	readonly #state: State;

	constructor(state: State) { this.#state = state }

	static { getState = <S>(object: object) => (object as LazyObject<S>).#state }
}

/**
 * Makes a class whose instances have the given properties. Each one is made from the instance's
 * state the first time it's read, and then becomes an ordinary property of that instance. The
 * properties are defined once, on the prototype, so making an instance costs next to nothing.
 */
export function makeLazyClass<State>(
	definitions: Iterable<LazyPropertyDefinition<State>>,
): new (state: State) => object {
	const lazyClass = class extends LazyObject<State> {};

	for (const [key, makeValue] of definitions) {
		define(lazyClass.prototype, key, lazy(key, function(this: object) {
			return makeValue(getState<State>(this));
		}));
	}

	return lazyClass;
}