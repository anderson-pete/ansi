import {count, noop} from "./utils";

const scroll = {
	up   : count<[lines?: number]>("S"),
	down : count<[lines?: number]>("T"),
};

export type Scroll = typeof scroll;

const disabled: Scroll = {
	up   : noop,
	down : noop,
};

export const makeScroll = (enabled = true): Scroll => enabled ? scroll : disabled;