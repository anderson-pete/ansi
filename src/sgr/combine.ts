import type {Code} from "./types";

export function combineCodes(base: Code, code: Code): Code {
	const set = new Set(Array.isArray(base) ? [...base] : [base]);

	if (Array.isArray(code)) {
		for (const c of code)
			set.add(c);
	} else
		set.add(code);

	return [...set];
}