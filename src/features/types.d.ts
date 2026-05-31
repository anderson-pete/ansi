export type ColorDepth = 1 | 3 | 4 | 8 | 24;

export interface Features {
	colorDepth : ColorDepth;
	style      : boolean;
	caret      : boolean;
	erase      : boolean;
	scroll     : boolean;
	terminal   : boolean;
}