import {lazy}              from "../lazy";
import {buildContext}      from "./context";
import {makeRGB, makeX256} from "./rgb";

import type {ColorDepth}                                        from "../../features";
import type {ChainKey, Channel, ColorKey, FormatBuilder, Style} from "../types";

const colors = [
	"black",
	"red",
	"green",
	"yellow",
	"blue",
	"magenta",
	"cyan",
	"white",
] as const;

export function makeChannel(
	keys          : ReadonlySet<ChainKey>,
	makeFormatter : FormatBuilder,
	style         : Style,
	colorDepth    : ColorDepth,
	channel       : ColorKey,
): Channel {
	const ctx = buildContext(keys, makeFormatter, style, colorDepth, channel);
	const {build, bright, open, close} = ctx;

	const rtn = {
		rgb     : makeRGB(ctx),
		x256    : makeX256(ctx),
		default : colorDepth > 1 ? `\x1b[${close}m` : "",
	} as Channel;

	for (let i = 0; i < colors.length; i++) {
		const color       = colors[i];
		const brightColor = `bright${color[0].toUpperCase()}${color.slice(1)}`;

		lazy.add(rtn, color,       () => build(open + i));
		lazy.add(rtn, brightColor, () => bright(i));
	}

	return rtn;
}