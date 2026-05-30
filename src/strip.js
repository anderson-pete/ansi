"use strict";

const {rxCSI, rxUnsafe} = require("./patterns");

/**
 * Remove all ANSI escape codes from the given text.
 * @type {(text: string) => string}
 */
const strip = text => text.replace(new RegExp(rxCSI), "");

/**
 * Calculate the visible length of a string with ANSI escape codes stripped.
 * @type {(text: string) => number}
 */
const visibleLength = text => strip(text).length;

/**
 * Remove all ANSI escape codes except SGR codes (m), which are used for color and styling.
 * @type {(text: string) => string}
 */
const sanitize = text => text.replace(new RegExp(rxUnsafe), "");

module.exports = {strip, visibleLength, sanitize};