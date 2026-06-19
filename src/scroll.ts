const scroll = {
	up   : (lines?: number): string => `\x1b[${lines ?? 1}S`,
	down : (lines?: number): string => `\x1b[${lines ?? 1}T`,
};

export type Scroll = typeof scroll;

const disabled: Scroll = {
	up   : () => "",
	down : () => "",
};

export const makeScroll = (enabled = true): Scroll => enabled ? scroll : disabled;