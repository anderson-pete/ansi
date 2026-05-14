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

type AttributeMap = Map<Attribute, number[]>;

export interface Atom {
	attribute : Attribute;
	code      : number[];
	skip?     : number;
}

export type BuildAtom = (
	attribute: Attribute,
	codes    : number[],
	index    : number,
	state    : AttributeMap,
) => Atom;