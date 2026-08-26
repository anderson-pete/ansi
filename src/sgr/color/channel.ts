import {csi}                 from "#utils";
import {lazy}                from "../lazy";
import {buildChannelContext} from "./context";
import {makeRGB, makeX256}   from "./rgb";

import type {ChainKey}      from "../chain";
import type {FormatContext} from "../context";
import type {Format}        from "../format";
import type {ColorKey}      from "./color";

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

export function makeChannel<Keys extends ChainKey>(
	formatContext : FormatContext<Keys>,
	channel       : ColorKey,
): Channel<Keys> {
	const channelContext                 = buildChannelContext(formatContext, channel);
	const {build, bright, close, offset} = channelContext;

	const rtn = {
		rgb     : makeRGB(channelContext),
		x256    : makeX256(channelContext),
		default : csi(close, "m"),
	} as unknown as Channel<Keys>;

	for (let i = 0; i < colors.length; i++) {
		const color       = colors[i];
		const brightColor = `bright${color[0].toUpperCase()}${color.slice(1)}`;

		lazy.add(rtn, color,       () => build(offset(i)));
		lazy.add(rtn, brightColor, () => bright(i));
	}

	return rtn;
}