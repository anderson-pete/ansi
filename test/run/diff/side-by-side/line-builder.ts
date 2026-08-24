import type {FormatBase} from "@peteanderson/ansi";

export class LineBuilder extends Array<string> {
	#highlight: FormatBase;

	appending = false;

	constructor(highlight: FormatBase) {
		super();
		this.#highlight = highlight;
	}

	push(text: string): number {
		if (this.appending) {
			this[this.length - 1] += text;
			if (/\x1b\[[0-9;]*m/.test(text)) {
				this.appending = false;
				this[this.length - 1] = this.#highlight(this[this.length - 1]);
			}
		} else
			super.push(text);

		return this.length;
	}

	toString(): string { return this.join("") }
}