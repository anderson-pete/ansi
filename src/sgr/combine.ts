import type {Code} from "./types";

export function combineCodes(base: Code, ...codes: Code[]): Code {
	const set = new Set(Array.isArray(base) ? [...base] : [base]);

	for (const code of codes) {
		if (Array.isArray(code)) {
			for (const c of code)
				set.add(c);
		} else
			set.add(code);
	}

	return [...set];
}