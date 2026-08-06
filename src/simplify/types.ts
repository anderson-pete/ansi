export type CodeArray = ReadonlyArray<number | "">;

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
	| number
	| "";

export type AttributeMap = Map<Attribute, CodeArray>;

export interface Atom {
	attribute : Attribute;
	code      : CodeArray;
	skip?     : number;
}

export type BuildAtom = (
	attribute : Attribute,
	codes     : CodeArray,
	index     : number,
	state     : AttributeMap,
) => Atom;