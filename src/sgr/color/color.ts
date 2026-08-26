import {lazy}        from "../lazy";
import {makeChannel} from "./channel";

import type {ChainKey}      from "../chain";
import type {FormatContext} from "../context";
import type {Channel}       from "./channel";

export const channels = ["fg", "bg"] as const;

export type ColorKey = typeof channels[number];

export type Color<Keys extends ChainKey = ChainKey> = {
	[K in Extract<ColorKey, Keys>]: Channel<Exclude<Keys, K>>;
};

export function makeColor<Keys extends ChainKey>(context: FormatContext<Keys>): Color<Keys> {
	const rtn = {} as Color<Keys>;

	for (const channel of channels) {
		if (context.keys.has(channel as Keys)) {
			lazy.add(rtn, channel, () => {
				const keys = new Set(context.keys);
				keys.delete(channel as Keys);
				const newContext: FormatContext<Keys> = {...context, keys};
				return makeChannel(newContext, channel);
			});
		}
	}

	return rtn;
}