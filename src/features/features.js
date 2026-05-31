"use strict";

const {Socket}                            = require("node:net");
const {WriteStream}                       = require("node:tty");
const {build, boolean, number, tty, pipe} = require("./build");
const {getColorDepth}                     = require("./detect");

/**
@typedef {import("./types").ColorDepth} ColorDepth
@typedef {import("./types").Features}   Features

@typedef {
	| [enabled    : boolean,           stream?: NodeJS.WriteStream]
	| [colorDepth : ColorDepth,        stream?: NodeJS.WriteStream]
	| [features   : Partial<Features>, stream?: NodeJS.WriteStream]
	| [socket     : Socket]
	| [stream?    : NodeJS.WriteStream]
} Args
*/

/** @type {(...args: Args) => Features} */
function getFeatures(...args) {
	let [features, stream] = args;

	if (typeof features === "boolean")
		return boolean((stream ?? process.stdout).isTTY, features);

	if (typeof features === "number")
		return number((stream ?? process.stdout).isTTY, features);

	if (!features || typeof features !== "object")
		features = (stream ?? process.stdout);

	if (features instanceof WriteStream)
		return tty(features);

	if (features instanceof Socket)
		return pipe();

	const {colorDepth, style, caret, erase, scroll, terminal} = features;

	stream ??= process.stdout;

	if (colorDepth)
		build(stream.isTTY, colorDepth, style, caret, erase, scroll, terminal);

	if (stream.isTTY)
		return build(true, getColorDepth(stream), style, caret, erase, scroll, terminal);

	return build(false, getColorDepth(), style, caret, erase, scroll, terminal);
}

module.exports = {getFeatures};