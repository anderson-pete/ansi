import {channels}  from "./color";
import {lazy}      from "./lazy";
import {styleKeys} from "./style";

import type {Color}              from "./color";
import type {Format, FormatBase} from "./format-builder";
import type {Style}              from "./style";

const chainKeys = [...channels, ...styleKeys] as const;

export type ChainKey = typeof chainKeys[number];

export type Chain<Keys extends ChainKey> = Color<Keys> & Style<Keys>;

export type ChainBuilder = <Keys extends ChainKey>(
	keys       : ReadonlySet<Keys>,
	baseFormat : FormatBase,
) => Chain<Keys>;

export const allKeys: ReadonlySet<ChainKey> = new Set(chainKeys);

export const attachChain = <Keys extends ChainKey>(
	makeChain  : ChainBuilder,
	keys       : ReadonlySet<Keys>,
	baseFormat : FormatBase,
): Format<Keys> => !keys.size
	? baseFormat as Format<Keys>
	: lazy.add(baseFormat, "and", () => makeChain(keys, baseFormat));