import type {Codes}           from "#code";
import type {Chain, ChainKey} from "../chain";

export interface FormatBase {
	(text: string): string;

	open    : string;
	close   : string;
	codes   : Codes;
	combine : (...formats: [FormatBase, ...FormatBase[]]) => FormatBase;
}

export interface ChainedFormat<Keys extends ChainKey = ChainKey> extends FormatBase {
	and: Chain<Keys>;
}

export type Format<Keys extends ChainKey = ChainKey> =
	[Keys] extends [never] ? FormatBase : ChainedFormat<Keys>;