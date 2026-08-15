import type {Cursor}                         from "./cursor";
import type {Delete, Erase, Insert}          from "./ins-del";
import type {Features}                       from "./features";
import type {PadEnd, PadStart}               from "./pad";
import type {Scroll}                         from "./scroll";
import type {SGR}                            from "./sgr";
import type {Simplify}                       from "./simplify";
import type {Slice}                          from "./slice";
import type {SplitAt}                        from "./split-at";
import type {Sanitize, Strip, VisibleLength} from "./strip";
import type {Terminal}                       from "./terminal";

export type Ansi = SGR & {
	cursor   : Cursor;
	delete   : Delete;
	erase    : Erase;
	insert   : Insert;
	scroll   : Scroll;
	terminal : Terminal;

	padEnd   : PadEnd;
	padStart : PadStart;

	strip         : Strip;
	visibleLength : VisibleLength;
	sanitize      : Sanitize;
	slice         : Slice;
	splitAt       : SplitAt;
	simplify      : Simplify;

	features : Features;
};