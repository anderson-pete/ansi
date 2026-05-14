"use strict";

const {lookUpAtom}                       = require("./lookup");
const {arraysEqual, transitionIntensity} = require("./utils");

/** @typedef {import("./types").Attribute}    Attribute */
/** @typedef {import("./types").AttributeMap} AttributeMap */

/** @type {Map<Attribute, number[]>} */
const defaultCodes = new Map([
	["intensity",    [22]],
	["italic",       [23]],
	["underline",    [24]],
	["inverse",      [27]],
	["hidden",       [28]],
	["strikethrough",[29]],
	["fg",           [39]],
	["bg",           [49]],
	["frame",        [54]],
	["overline",     [55]],
]);

/** @type {AttributeMap} */
class State extends Map {
	/** @type {(codes: number[]) => number[]} */
	update(codes) {
		/** @type {AttributeMap} */
		let snapshot = new Map(this);

		/** @type {Set<Attribute>} */
		const attributes = new Set();

		for (let i = 0; i < codes.length; i++) {
			const {attribute, code, skip} = lookUpAtom(codes, i, this);

			if (attribute === "reset") {
				attributes.clear();
				this.clear();
				attributes.add("reset");
				for (const [attr, defaultCode] of defaultCodes)
					this.set(attr, defaultCode);

				snapshot = new Map(this);
				continue;
			}

			attributes.add(attribute);
			this.set(attribute, code);

			if (skip)
				i += skip;
		}

		return Array.from(attributes).flatMap(attribute => {
			if (attribute === "reset")
				return [0];

			const code = this.get(attribute);

			if (arraysEqual(code, snapshot.get(attribute)))
				return [];

			if (attribute === "intensity") {
				const previous = snapshot.get(attribute);
				return transitionIntensity(previous, code);
			}

			return code;
		});
	}
}

module.exports = {State};