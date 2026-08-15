import {count, noop} from "./utils";

const scroll = {
	up   : count<[lines?: number]>("S", "T"),
	down : count<[lines?: number]>("T", "S"),
};

export type Scroll = typeof scroll;

const disabled: Scroll = {
	up   : noop,
	down : noop,
};

export const makeScroll = (enabled = true): Scroll => enabled ? scroll : disabled;