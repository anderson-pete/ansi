import {lookUpAtom}                       from "./lookup";
import {arraysEqual, transitionIntensity} from "./utils";

import type {Attribute, AttributeMap} from "./types";

const defaultCodes: Map<Attribute, number[]> = new Map([
	["intensity",     [22]],
	["italic",        [23]],
	["underline",     [24]],
	["inverse",       [27]],
	["hidden",        [28]],
	["strikethrough", [29]],
	["fg",            [39]],
	["bg",            [49]],
	["frame",         [54]],
	["overline",      [55]],
]);

export class State extends Map<Attribute, number[]> implements AttributeMap {
	update(codes: number[]): number[] {
		let snapshot: AttributeMap = new Map(this);

		const attributes = new Set<Attribute>();

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

			const code = this.get(attribute)!;

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