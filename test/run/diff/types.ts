export type DiffType    = "equal" | "insert" | "delete";
export type DiffSegment = string[] & {type: DiffType};