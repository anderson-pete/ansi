/** @typedef {number | number[]} Code */

/** @type {(code: Code, codes: Code[]) => Code} */
function combine(code, codes, ) {
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

module.exports = {combine};