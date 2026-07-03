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
	#isDefaultState(except?: Attribute): boolean {
		for (const [attribute, defaultCode] of defaultCodes) {
			if (attribute === except)
				continue;

			const current = this.get(attribute);
			if (!arraysEqual(current, defaultCode))
				return false;
		}
		return true;
	}

	update(codes: number[]): Array<number | string> {
		let snapshot: AttributeMap = new Map(this);

		const attributes = new Set<Attribute>();

		for (let i = 0; i < codes.length; i++) {
			const {attribute, code, skip} = lookUpAtom(codes, i, this);

			if (attribute === "reset") {
				if (this.#isDefaultState())
					continue;

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

		const rtn: Array<number | string> = [];

		for (const attribute of attributes) {
			if (attribute === "reset") {
				rtn.length = 0; // Any previous codes are irrelevant.
				rtn.push("");   // The terminal will interpret missing values as `0`.
				continue;
			}

			const code = this.get(attribute)!;

			if (arraysEqual(code, snapshot.get(attribute)))
				continue;

			// If this code would put us in a known overall default state, then we can just reset,
			// which is shorter. (Compare `\x1b[m` vs. `\x1b[39m` or especially `\x1b[22;39;49m`.)
			if (arraysEqual(code, defaultCodes.get(attribute)) && this.#isDefaultState(attribute)) {
				rtn.length = 0;
				rtn.push("");
				continue;
			}

			if (attribute === "intensity") {
				const previous = snapshot.get(attribute);
				rtn.push(...transitionIntensity(previous, code));
				continue;
			}

			rtn.push(...code);
		}

		return rtn;
	}
}