"use strict";

/** @type {(stream: NodeJS.WriteStream) => number} */
const getColorDepth = (stream) =>
	stream.isTTY ?
		stream.getColorDepth() :
	process.env.FORCE_COLOR !== undefined ?
		["1", "true", ""].includes(process.env.FORCE_COLOR) ?
			4 :
		process.env.FORCE_COLOR === "2" ?
			8 :
		process.env.FORCE_COLOR === "3" ?
			24 :
		1 :
	1;

const colorDepth = {
	stdout: getColorDepth(process.stdout),
	stderr: getColorDepth(process.stderr),
};

const enabled = {
	stdout: colorDepth.stdout > 1,
	stderr: colorDepth.stderr > 1,
};

module.exports = {colorDepth, enabled};