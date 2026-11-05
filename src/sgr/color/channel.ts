import {csi}                 from "#utils";
import {makeLazyClass}       from "../lazy-class";
import {buildChannelContext} from "./context";
import {makeRGB, makeX256}   from "./rgb";

import type {ChainKey}               from "../chain";
import type {FormatContext}          from "../context";
import type {Format}                 from "../format";
import type {LazyPropertyDefinition} from "../lazy-class";
import type {ColorKey}               from "./color";
import type {ChannelContext}         from "./context";

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

const definitions: LazyPropertyDefinition<ChannelContext>[] = [
	["rgb",     context => makeRGB(context)],
	["x256",    context => makeX256(context)],
	["default", context => csi("m", context.close)],
];

for (let i = 0; i < colors.length; i++) {
	const color       = colors[i];
	const brightColor = `bright${color[0].toUpperCase()}${color.slice(1)}`;

	definitions.push([color,       context => context.build(context.offset(i))]);
	definitions.push([brightColor, context => context.bright(i)]);
}

const Channel = makeLazyClass(definitions);

export const makeChannel = <Keys extends ChainKey>(
	formatContext : FormatContext<Keys>,
	channel       : ColorKey,
): Channel<Keys> => new Channel(buildChannelContext(formatContext, channel)) as Channel<Keys>;