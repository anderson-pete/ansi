export type Attribute =
	| "intensity"
	| "italic"
	| "underline"
	| "inverse"
	| "hidden"
	| "strikethrough"
	| "fg"
	| "bg"
	| "frame"
	| "overline"
	| "reset"
	| number;

export type AttributeMap = Map<Attribute, readonly number[]>;

export interface Atom {
	attribute : Attribute;
	code      : readonly number[];
	skip?     : number;
}

export type BuildAtom = (
	attribute : Attribute,
	codes     : readonly number[],
	index     : number,
	state     : AttributeMap,
) => Atom;