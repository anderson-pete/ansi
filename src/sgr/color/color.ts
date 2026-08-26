"use strict";

import {lazy}        from "../lazy";
import {makeChannel} from "./channel";

import type {ColorDepth}      from "#features";
import type {ChainKey}        from "../chain";
import type {FormatBuilder}   from "../format-builder";
import type {Style}           from "../style";
import type {Channel}         from "./channel";

export const channels = ["fg", "bg"] as const;

export type ColorKey = typeof channels[number];

export type Color<Keys extends ChainKey = ChainKey> = {
	[K in Extract<ColorKey, Keys>]: Channel<Exclude<Keys, K>>;
};

export function makeColor(
	keys          : ReadonlySet<ChainKey>,
	makeFormatter : FormatBuilder,
	style         : Style,
	colorDepth    : ColorDepth,
): Color<any> {
	const rtn = {} as Color<any>;

	for (const channel of channels) {
		if (keys.has(channel)) {
			lazy.add(rtn, channel, () => {
				const newKeys = new Set(keys);
				newKeys.delete(channel);
				return makeChannel(newKeys, makeFormatter, style, colorDepth, channel);
			});
		}
	}

	return rtn;
}