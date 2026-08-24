import type {DiffSegment} from "../types";

export interface Context {
	longest : {
		left  : {line: number, number: number};
		right : {line: number, number: number};
	};
	leftIndex  : number;
	rightIndex : number;
}

export interface AlignedLine {
	left?  : number;
	right? : number;
	diffs? : readonly DiffSegment[];
}