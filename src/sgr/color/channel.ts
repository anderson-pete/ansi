import {csi}               from "#utils";
import {lazy}              from "../lazy";
import {buildContext}      from "./context";
import {makeRGB, makeX256} from "./rgb";

import type {ColorDepth}            from "#features";
import type {ChainKey}              from "../chain";
import type {Format, FormatBuilder} from "../format-builder";
import type {Style}                 from "../style";
import type {ColorKey}              from "./color";

export interface Channel<Keys extends ChainKey = ChainKey> {
	black   : Format<Keys>;
	red     : Format<Keys>;
	green   : Format<Keys>;
	yellow  : Format<Keys>;
	blue    : Format<Keys>;
	magenta : Format<Keys>;
	cyan    : Format<Keys>;
	white   : Format<Keys>;

	brightBlack   : Format<Keys>;
	brightRed     : Format<Keys>;
	brightGreen   : Format<Keys>;
	brightYellow  : Format<Keys>;
	brightBlue    : Format<Keys>;
	brightMagenta : Format<Keys>;
	brightCyan    : Format<Keys>;
	brightWhite   : Format<Keys>;

	rgb: (r: number, g: number, b: number) => Format<Keys>;

	x256: {
		(code: number): Format<Keys>;
		(r: number, g: number, b: number): Format<Keys>;
	};

	default: string,
}

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
	const {build, bright, close, offset} = ctx;

	const rtn = {
		rgb     : makeRGB(ctx),
		x256    : makeX256(ctx),
		default : colorDepth > 1 ? csi(close, "m") : "",
	} as Channel;

	for (let i = 0; i < colors.length; i++) {
		const color       = colors[i];
		const brightColor = `bright${color[0].toUpperCase()}${color.slice(1)}`;

		lazy.add(rtn, color,       () => build(offset(i)));
		lazy.add(rtn, brightColor, () => bright(i));
	}

	return rtn;
}