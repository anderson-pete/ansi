"use strict";

const {buildExtendedColorAtom, buildIntensityAtom} = require("./atom");

/** @typedef {import("./types").Atom}         Atom */
/** @typedef {import("./types").Attribute}    Attribute */
/** @typedef {import("./types").AttributeMap} AttributeMap */
/** @typedef {import("./types").BuildAtom}    BuildAtom */

/** @type {Record<number, [attribute: Attribute, buildAtom?: BuildAtom]>} */
const codeMap = {
	0   : ["reset"],
	1   : ["intensity", buildIntensityAtom],
	2   : ["intensity", buildIntensityAtom],
	3   : ["italic"],
	4   : ["underline"],
	7   : ["inverse"],
	8   : ["hidden"],
	9   : ["strikethrough"],
	21  : ["underline"],
	22  : ["intensity", buildIntensityAtom],
	23  : ["italic"],
	24  : ["underline"],
	27  : ["inverse"],
	28  : ["hidden"],
	29  : ["strikethrough"],
	30  : ["fg"],
	31  : ["fg"],
	32  : ["fg"],
	33  : ["fg"],
	34  : ["fg"],
	35  : ["fg"],
	36  : ["fg"],
	37  : ["fg"],
	38  : ["fg", buildExtendedColorAtom],
	39  : ["fg"],
	40  : ["bg"],
	41  : ["bg"],
	42  : ["bg"],
	43  : ["bg"],
	44  : ["bg"],
	45  : ["bg"],
	46  : ["bg"],
	47  : ["bg"],
	48  : ["bg", buildExtendedColorAtom],
	49  : ["bg"],
	51  : ["frame"],
	52  : ["frame"],
	53  : ["overline"],
	54  : ["frame"],
	55  : ["overline"],
	90  : ["fg"],
	91  : ["fg"],
	92  : ["fg"],
	93  : ["fg"],
	94  : ["fg"],
	95  : ["fg"],
	96  : ["fg"],
	97  : ["fg"],
	100 : ["bg"],
	101 : ["bg"],
	102 : ["bg"],
	103 : ["bg"],
	104 : ["bg"],
	105 : ["bg"],
	106 : ["bg"],
	107 : ["bg"],
};

/** @type {(codes: number[], index: number, state: AttributeMap) => Atom} */
function lookUpAtom(codes, index, state) {
	const code  = codes[index];
	const entry = codeMap[code];

	if (!entry)
		return {attribute: code, code: [code]};

	const [attribute, buildAtom] = entry;

	if (buildAtom)
		return buildAtom(attribute, codes, index, state);

	return {attribute, code: [code]};
}

module.exports = {lookUpAtom};