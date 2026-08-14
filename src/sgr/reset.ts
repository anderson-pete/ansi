import {csi} from "../utils";

export const makeReset = (enabled = true): string => enabled ? csi("m") : "";