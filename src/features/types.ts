import type {Socket} from "node:net";

export type ColorDepth = 1 | 3 | 4 | 8 | 24;

export interface Features {
	colorDepth : ColorDepth;
	style      : boolean;
	caret      : boolean;
	erase      : boolean;
	scroll     : boolean;
	terminal   : boolean;
}

export type Args =
	| [enabled    : boolean,           stream?: NodeJS.WriteStream]
	| [colorDepth : ColorDepth,        stream?: NodeJS.WriteStream]
	| [features   : Partial<Features>, stream?: NodeJS.WriteStream]
	| [socket     : Socket]
	| [stream?    : NodeJS.WriteStream];