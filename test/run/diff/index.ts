import {diff as _diff} from "./diff";
import {sideBySide}    from "./side-by-side";

export const diff = Object.assign(_diff, {sideBySide});