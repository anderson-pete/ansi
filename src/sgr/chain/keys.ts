import {channels}  from "../color";
import {styleKeys} from "../style";

const chainKeys = [...channels, ...styleKeys] as const;

export type ChainKey = typeof chainKeys[number];

export const allKeys: ReadonlySet<ChainKey> = new Set(chainKeys);