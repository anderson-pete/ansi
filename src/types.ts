import type {Caret}                          from "./caret";
import type {Erase}                          from "./erase";
import type {Features}                       from "./features";
import type {PadEnd, PadStart}               from "./pad";
import type {Scroll}                         from "./scroll";
import type {SGR}                            from "./sgr";
import type {Simplify}                       from "./simplify";
import type {Slice}                          from "./slice";
import type {Sanitize, Strip, VisibleLength} from "./strip";
import type {Terminal}                       from "./terminal";

export type Ansi = SGR & {
	caret    : Caret;
	erase    : Erase;
	scroll   : Scroll;
	terminal : Terminal;

	padEnd   : PadEnd;
	padStart : PadStart;

	strip         : Strip;
	visibleLength : VisibleLength;
	sanitize      : Sanitize;
	slice         : Slice;
	simplify      : Simplify;

	features : Features;
};