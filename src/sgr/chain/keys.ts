import {channels}  from "../color";
import {styleKeys} from "../style";
import {ChainKeys} from "./chain-keys";

const chainKeys = [...channels, ...styleKeys] as const;

export type ChainKey = typeof chainKeys[number];

export const allKeys = ChainKeys.forKeys(chainKeys);