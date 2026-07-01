import {Socket}                            from "node:net";
import {WriteStream}                       from "node:tty";
import {boolean, build, number, pipe, tty} from "./build";
import {getColorDepth}                     from "./detect";

import type {Args, Features} from "./types";

export function getFeatures(...args: Args): Features {
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