export type Code  = number | "" | ReadonlyArray<number | "">;
export type Codes = {open: Code, close: Code};

export namespace Code {
	export const disabled: Code = Object.freeze([]);

	export const isDisabled = (code: Code): boolean =>
		code === disabled || Array.isArray(code) && !code.length;
}