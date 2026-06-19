import type {BuildAtom} from "./types";

export const buildExtendedColorAtom: BuildAtom = (attribute, codes, index) => {
	switch (codes[index + 1]) {
		case 2:
			if (index + 5 >= codes.length)
				return {attribute, code: codes.slice(index), skip: codes.length - index - 1};
			return {attribute, code: codes.slice(index, index + 5), skip: 4};
		case 5:
			if (index + 3 >= codes.length)
				return {attribute, code: codes.slice(index), skip: codes.length - index - 1};
			return {attribute, code: codes.slice(index, index + 3), skip: 2};
		default:
			return {attribute, code: codes.slice(index, index + 2), skip: 1};
	}
};

export const buildIntensityAtom: BuildAtom = (attribute, codes, index, state) => {
	const code = codes[index];
	if (code === 22)
		return {attribute, code: [code]};

	const current = state.get("intensity");
	if (
		// If there is no intensity currently in the state, then we can just set the new state.
		!current ||
		// If the current intensity is normal (22), then we can just set the new state.
		// Note that while the ultimate transition may return a code sequence of `[22, 1]` or
		// `[22, 2]`, in our state representation, the only two-code intensity is `[1, 2]`.
		current[0] === 22 ||
		// If the current intensity is equal to the new intensity, then return the same state.
		current.length === 1 && current[0] === code
	)
		return {attribute, code: [code]};

	// Otherwise, we need to set both intensity codes.
	return {attribute, code: [1, 2]};
};