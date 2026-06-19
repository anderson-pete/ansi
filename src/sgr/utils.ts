import type {Code} from "./sgr";

export function combine(code: Code, codes: Code[]): Code {
	if (!codes.length)
		return code;

	const rtn = Array.isArray(code) ? [...code] : [code];

	for (const c of codes) {
		if (Array.isArray(c))
			rtn.push(...c);
		else
			rtn.push(c);
	}

	return rtn;
}