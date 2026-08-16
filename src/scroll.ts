import {csi, count, noop} from "./utils";

const scroll = {
	up        : count<[lines?: number]>("S", "T"),
	down      : count<[lines?: number]>("T", "S"),
	setRegion : (top?: number, bottom?: number) =>
		csi(
			!top || top < 2 ? // Omit top if we can use the default.
				bottom :
			!bottom ?
				top :
			`${top};${bottom}`,
			"r",
		),
};

export type Scroll = typeof scroll;

const disabled: Scroll = {
	up        : noop,
	down      : noop,
	setRegion : noop,
};

export const makeScroll = (enabled = true): Scroll => enabled ? scroll : disabled;