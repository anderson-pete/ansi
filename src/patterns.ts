/*
I'm freezing these to prevent accidental mutation of the `lastIndex` property, which could keep
future calls from starting at the beginning of the string.

Code using these objects will have to clone them (with `new RegExp(rx)`) before using functions
that modify `lastIndex` (such as `exec`). But according to my benchmarks, cloning the regex takes
mere nanoseconds, and it wasn't even measurable when operating on longer strings. V8 clearly uses a
global cache of compiled regexes. I assume that SpiderMonkey does the same thing.

Here are my `timeit` benchmark results:

```js
const {timeit} = require("$timeit");

const rxSGR = /\x1b\[[\d;]*m/g;
const short = "\x1b[31mred \x1b[32mgreen \x1b[34mblue \x1b[0m";
const long  = short.repeat(1000);

timeit(() => short.replace(rxSGR, ""),                         {description: "short - no clone     "});
timeit(() => short.replace(new RegExp(rxSGR), ""),             {description: "short - clone object "});
timeit(() => short.replace(new RegExp(rxSGR.source, "g"), ""), {description: "short - clone source "});

console.log();

timeit(() => long .replace(rxSGR, ""),                         {description: "long  - no clone     "});
timeit(() => long .replace(new RegExp(rxSGR), ""),             {description: "long  - clone object "});
timeit(() => long .replace(new RegExp(rxSGR.source, "g"), ""), {description: "long  - clone source "});

// Output:
// short - no clone     : 82.73 ns (12,087,731 in 1.000016982 s)
// short - clone object : 142.132 ns (7,035,692 in 1.0000001770000002 s)
// short - clone source : 127.872 ns (7,820,293 in 1.00000017 s)
//
// long  - no clone     : 47.953 ųs (20,854 in 1.0000098149999999 s)
// long  - clone object : 46.713 ųs (21,408 in 1.0000285520000003 s)
// long  - clone source : 46.491 ųs (21,510 in 1.000026492 s)
```
*/

export const rxSGR    = Object.freeze(/\x1b\[([\d;]*)m/g);
export const rxCSI    = Object.freeze(/\x1b\[[0-?]*[ -/]*[@-~]/g);
export const rxUnsafe = Object.freeze(/\x1b\[[0-?]*[ -/]*[@-ln-~]/g); // Everything except SGR codes (m).