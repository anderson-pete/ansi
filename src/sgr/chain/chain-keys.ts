import type {ChainClass} from "./build";
import type {ChainKey}   from "./keys";

/**
 * A set of keys. There's only ever one with any particular contents (get it with `forKeys`), so
 * they can be told apart by identity, and what's derived from them is kept right on them. They must
 * not be modified.
 */
export class ChainKeys<
	Keys extends ChainKey = ChainKey
> extends Set<Keys> implements ReadonlySet<Keys> {
	static readonly #canonical = new Map<string, ChainKeys>();

	/** The class of the chains that have these keys, which `makeChain` makes when it's needed. */
	chainClass?: ChainClass;

	readonly #without: Partial<Record<ChainKey, ChainKeys>> = {};

	private constructor(keys: Iterable<Keys>) { super(keys) }

	/** Gets the `ChainKeys` that has the same keys as a set. */
	static forKeys<Keys extends ChainKey = ChainKey>(keys: Iterable<Keys>): ChainKeys<Keys> {
		if (keys instanceof ChainKeys)
			return keys;

		const id = [...keys].sort().join();
		let chainKeys = ChainKeys.#canonical.get(id);

		if (!chainKeys)
			ChainKeys.#canonical.set(id, chainKeys = new ChainKeys(keys));

		return chainKeys as any;
	}

	/** Gets the `ChainKeys` that has these keys except for one. */
	withoutKey<Key extends ChainKey>(key: Key): ChainKeys<Exclude<Keys, Key>> {
		return this.#without[key] ??= ChainKeys.forKeys(
			new Set([...this].filter(other => other !== key as any)),
		) as any;
	}
}