export function arraysEqual<T>(a: readonly T[] | undefined, b: readonly T[] | undefined): boolean {
	if (a === b)
		return true;

	if (!a || !b || a.length !== b.length)
		return false;

	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i])
			return false;
	}

	return true;
}

export function transitionIntensity(
	previous : readonly number[] | undefined,
	current  : readonly number[],
): readonly number[] {
	if (!previous || previous[0] === 22 || current[0] === 22)
		return current;

	const oldBold = previous[0] === 1;
	const newBold = current[0] === 1;
	const oldDim  = previous[previous.length - 1] === 2;
	const newDim  = current[current.length - 1] === 2;

	const result: number[] = [];

	if (oldBold && !newBold || oldDim && !newDim)
		result.push(22);
	if (newBold && (!oldBold || result[0] === 22))
		result.push(1);
	if (newDim && (!oldDim || result[0] === 22))
		result.push(2);

	return result;
}