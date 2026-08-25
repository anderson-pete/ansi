export type Code = number | "" | ReadonlyArray<number | "">;

export namespace Code {
	export const disabled: Code = Object.freeze([]);

	export const isDisabled = (code: Code): boolean =>
		code === disabled || Array.isArray(code) && !code.length;
}