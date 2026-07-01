export type TypedPropertyDescriptorMap<T> = {
	[K in keyof T]: TypedPropertyDescriptor<T[K]>;
};

export interface TypedObject {
	getOwnPropertyNames<T>(o: T): KeyOf<T>[];

	keys<T>   (o: T): KeyOf<T>[];
	values<T> (o: T): ValuesOf<T>;
	entries<T>(o: T): EntriesOf<T>;
	fromEntries<K extends keyof any, V>(entries: Iterable<readonly [K, V]>): Record<K, V>;

	create<T>(prototype: object, properties: TypedPropertyDescriptorMap<T>): T;

	recreate<T, U>(
		o  : T,
		fn : <K extends keyof T>(
			key      : K,
			property : TypedPropertyDescriptor<T[K]>
		) => [K, TypedPropertyDescriptor<U>]
	): Record<keyof T, U>;

	transform<T, K extends keyof any, V>(
		o  : T,
		fn : (key: KeyOf<T>, value: T[keyof T]) => readonly [K, V]
	): Record<K, V>;

	toMap<T extends {}, K = KeyOf<T>, V = T[keyof T]>(
		o          : T,
		transform? : (key: KeyOf<T>, value: T[keyof T]) => readonly [K, V]
	): Map<K, V>;
}
export const TypedObject = Object.freeze({
	getOwnPropertyNames : Object.getOwnPropertyNames,
	keys                : Object.keys,
	values              : Object.values,
	entries             : Object.entries,
	fromEntries         : Object.fromEntries,
	create              : Object.create,

	recreate: <T, U>(
		o  : T,
		fn : <K extends keyof T>(
			key      : K,
			property : TypedPropertyDescriptor<T[K]>
		) => [K, TypedPropertyDescriptor<U>]
	): Record<keyof T, U> => Object.create(
		Object.getPrototypeOf(o),
		TypedObject.transform(Object.getOwnPropertyDescriptors(o), fn as any),
	),

	transform: <T, K extends keyof any, V>(
		o  : T,
		fn : (key: KeyOf<T>, value: T[keyof T]) => readonly [K, V],
	): Record<K, V> => TypedObject.fromEntries(
		TypedObject.entries(o).map(([key, value]) => fn(key as any, value)),
	),

	/**
	@type {
		<T extends {}, K = KeyOf<T>, V = T[keyof T]>(
			o          : T,
			transform? : (key: KeyOf<T>, value: T[keyof T]) => readonly [K, V]
		) => Map<K, V>
	}
	*/
	toMap<T extends {}, K = KeyOf<T>, V = T[keyof T]>(
		o          : T,
		transform? : (key: KeyOf<T>, value: T[keyof T]) => readonly [K, V],
	): Map<K, V> {
		const map = new Map<K, V>();

		if (transform) {
			for (const [key, value] of TypedObject.entries(o)) {
				const [newKey, newValue] = transform(key as any, value);
				map.set(newKey, newValue);
			}
		} else {
			for (const [key, value] of TypedObject.entries(o))
				map.set(key as any, value as any);
		}

		return map;
	},
}) as TypedObject;