import {define} from "@peteanderson/props";

import type {GetterProperty} from "@peteanderson/props";

export function lazy<K extends keyof any, V>(key: K, get: () => V): GetterProperty<V> {
	return {
		get() {
			const value = get();
			define(this, key, {value, enumerable: true});
			return value;
		},
		enumerable   : true,
		configurable : true,
	};
}

lazy.add = <T extends object, K extends keyof any, V>(
	obj : T,
	key : K,
	get : () => V,
): T & {[k in K]: V} => define(obj, key, lazy(key, get));