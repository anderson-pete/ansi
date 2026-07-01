import {rxCSI, rxUnsafe} from "./patterns";

/** Remove all ANSI escape codes from the given text. */
export const strip         = (text: string): string => text.replace(new RegExp(rxCSI), "");

/** Calculate the visible length of a string with ANSI escape codes stripped. */
export const visibleLength = (text: string): number => strip(text).length;

/** Remove all ANSI escape codes except SGR codes (m), which are used for color and styling. */
export const sanitize      = (text: string): string => text.replace(new RegExp(rxUnsafe), "");

export type Strip         = typeof strip;
export type VisibleLength = typeof visibleLength;
export type Sanitize      = typeof sanitize;