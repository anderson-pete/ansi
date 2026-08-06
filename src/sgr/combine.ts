import {State} from "../simplify/state";

import type {Code} from "./types";

export const combineCodes = (base: Code, ...codes: Code[]): Code =>
	new State().update([base, ...codes].flat());