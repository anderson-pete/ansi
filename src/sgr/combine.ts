import {State} from "../simplify/state";

import type {Code} from "#code";

export const combineCodes = (base: Code, ...codes: Code[]): Code =>
	new State().update([base, ...codes].flat());