import type {SGR} from "../sgr";

export interface Channel {
	black   : SGR;
	red     : SGR;
	green   : SGR;
	yellow  : SGR;
	blue    : SGR;
	magenta : SGR;
	cyan    : SGR;
	white   : SGR;

	brightBlack   : SGR;
	brightRed     : SGR;
	brightGreen   : SGR;
	brightYellow  : SGR;
	brightBlue    : SGR;
	brightMagenta : SGR;
	brightCyan    : SGR;
	brightWhite   : SGR;

	rgb: (r: number, g: number, b: number) => SGR;

	x256: {
		(code: number): SGR;
		(r: number, g: number, b: number): SGR;
	};

	default: string;
}

export type Color = {fg: Channel; bg: Channel};