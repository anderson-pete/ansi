import type {ColorDepth, Features} from "./types";

export function getColorDepth(stream?: NodeJS.WriteStream): ColorDepth {
	if (stream?.isTTY)
		return stream.getColorDepth() as ColorDepth;

	if (process.env.NO_COLOR || process.env.NODE_DISABLE_COLORS)
		return 1;

	switch (process.env.FORCE_COLOR) {
		case "":
		case "true":
		case "1":
			return 4;
		case "2":
			return 8;
		case "3":
			return 24;
		default:
			return 1;
	}
}

export function detectFeatureSupport(
	isTTY      : boolean,
	colorDepth : ColorDepth,
): Omit<Features, "colorDepth"> {
	const enabled = process.env.TERM !== "dumb" && isTTY;
	return {
		style    : colorDepth > 1,
		caret    : enabled,
		erase    : enabled,
		scroll   : enabled,
		terminal : enabled,
	};
}