"use strict";

import {lazy}        from "../lazy";
import {makeChannel} from "./channel";

import type {ColorDepth}                            from "../../features";
import type {ChainKey, Color, FormatBuilder, Style} from "../types";

const channels = ["fg", "bg"] as const;

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