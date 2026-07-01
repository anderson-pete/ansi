// https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
type UnionToIntersection<U> =
	(U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type StringKey<T> = T extends number ? `${T}` : T extends string ? T : never;
type KeyOf<T>     = StringKey<keyof T>;

type ValueOf<T, K extends keyof T = keyof T> = Required<T>[K];
type ValuesOf<T, K extends [...(keyof T)[]] = (keyof T)[]> = {
	[P in keyof K]: K[P] extends keyof T ? ValueOf<T, K[P]> : never;
};

type EntryOf<T, K extends keyof T = keyof T> = [K, ValueOf<T, K>];
type EntriesOf<T, K extends [...(keyof T)[]] = (keyof T)[]> = {
	[P in keyof K]: K[P] extends keyof T ? EntryOf<T, K[P]> : never;
};

type SkipFirst<T> = T extends [infer First, ...infer Rest] ? Rest : [];