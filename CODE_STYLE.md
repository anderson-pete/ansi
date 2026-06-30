# Code Style

Personal style guide. Not compatible with Prettier or Biome — do not run formatters.
ESLint may be used for linting with custom rule configuration.

---

## Formatting Basics

 * **Indentation:** tabs. **Alignment:** spaces. Never mix (a tab-indented line may have trailing spaces for alignment, but alignment spaces never substitute for a tab indent).
 * **Tab width assumption:** 4 spaces, for line-length calculations only.
 * **Line length:** ≤100 characters. Exceptions are allowed where grouping similar lines improves readability. Exceptions are rare.
 * **Files do not end with a newline.**
 * **Semicolons:** required at the end of statements. The sole exception is when short blocks are unwrapped to a single line but must be enclosed in curly braces. Examples:

   ```ts
   class Foo {
       get name() { return "Foo" }
   };

   try { doSomething() } catch (E) { handle(E) };
   ```
 * **E:** Catch block parameter is usually named `E`. This avoids confusion with `e`, commonly used for events and other variables, and its distinct appearance emphasizes its special role as an error object.

---

## Braces and Blocks

Single-line blocks omit curly braces, but the body goes on its own line:

```ts
if (condition)
	doSomething();

for (const item of items)
	process(item);
```

Multi-line blocks always use curly braces, even if they contain only one statement:

```ts
if (condition) {
	doSomething();
	doSomethingElse();
}

for (const item of items) {
	if (condition(item))
		callback(item);
}

if (condition) {
	// some comment
	doSomething();
}

if (condition) {
	doSomething(
		"With a long argument list that requires wrapping to the next line " +
			"in order to keep the line from getting too long.",
		"Notice the `if` block needs curly braces in this case.",
	);
}
```

---

## Parentheses

Don't use unnecessary parentheses. Prettier's rules add unnecessary parentheses in many situations. Don't be Prettier. Learn the precedence rules of the language. For example, all of the parentheses below are unnecessary, but would be added by Prettier:

```ts
// Bad:
const foo         = condition ? (a as Foo) : b;
const element     = <div>{condition && (<Component />)}</div>;
const doSomething = condition1 || (condition2 && condition3);
```

---

## Spacing

**No spaces inside curly braces** for object literals, destructuring, or imports:

```ts
import {foo, bar} from "module";

const {a, b} = obj;
const obj    = {x: 1, y: 2};
```

Standard spacing for most operators:

 * **One space on either side** of binary operators
 * **No space before and one space after** commas and colons (but see Table Alignment for multiline contexts)
 * **One space inside curly braces used for code blocks that are not wrapped to multiple lines**

   ```ts
   class Foo {
       get name() { return "Foo" } // no trailing semicolon in this case
   };
   ```

---

## Trailing Commas

Required in all multiline contexts: object literals, arrays, function parameters, imports, etc.

```ts
const obj = {
	a: 1,
	b: 2,  // ← trailing comma
};

function foo(
	arg1: string,
	arg2: number,  // ← trailing comma
): void {}

import {
	Alpha,
	Beta,  // ← trailing comma
} from "module";
```

Not used in single-line contexts.

---

## Line Wrapping

When a call, signature, or literal must wrap, use a **single indent level** — never align to the opening delimiter:

```ts
// Good
const result = someFunction(
	arg1,
	arg2,
	arg3,
);

// Bad
const result = someFunction(
                            arg1,
                            arg2,
                            arg3,
);
```

---

## Constants

Do not use `ALL_CAPS` for constants. Use normal `camelCase`. There is no reason to scream.

---

## TypeScript Types

### Explicit Types

Explicit parameter and return types on named functions, unless types are inferred from *external* context (e.g., a typed record or interface the function is assigned into).

The return type of a simple arrow function can be omitted if it's obvious to both humans and the compiler.

```ts
// Good
function foo(a: number, b: number): number {
	const aPrime = bar(a, b);
	const bPrime = bar(b, a);
	return aPrime + bPrime;
}

const double = (n: number) => n * 2;  // return type obvious

const funcs: Record<string, (a: number, b: number) => number> = {
	// types inferred from Record — no annotation needed
	foo(a, b) { return a + b },
	bar: (a, b) => a / b,
};

// Bad
function foo(a: number, b: number) {  // return type should be explicit
	return a + b;
}

const double = (n: number): number => n * 2;  // return type is unnecessary noise
```

**This is not just a style choice.** There is solid architectural reasoning here:

 * Obviously, untyped parameters will usually infer to `any`, which defeats the purpose of using TypeScript.

 * TypeScript can infer return types in most cases, but it has a performance cost, because it has to analyze the function body (and its callees if necessary) to determine the return type. This can contribute to poor editor performance.

 * When type signatures are provided by external context, such as a typed record or parameter, then _omitting_ the signatures is usually preferable, as it keeps us from repeating ourselves and makes it easier to make changes later.

### `interface` vs `type`

Prefer `interface` over `type` for object shapes, unless `type`-specific features (unions, intersections, mapped types) are needed.

---

## Imports

**Group order:**
 1. Absolute imports (npm packages, path aliases) — sorted lexically by module name
 2. Relative imports — sorted lexically by path; higher-level paths (`../`) before lower-level (`./`)
 3. Type-only imports (`import type`) — sorted as above
 4. Side-effect imports — sorted as above

**Within each group:** sorted alphabetically by imported name (case-insensitive).

**Mixed type+value imports** (`import {A, type B}`) go last within their group. Prefer separate type imports where practical. It's also acceptable to omit the `type` keyword in mixed imports.

**Alignment:** align the `from` keyword across all imports when practical.

**Other rules:**
 * Avoid long relative paths — use path aliases instead (`$foo` instead of `../../../foo`).
 * `node:path` → import as `Path` (capital) to avoid shadowing variables named `path`
 * Kebab-case for local module and directory names
 * Do not separate import groups with blank lines

```ts
import {foo}                from "@some-package";
import {Footer, Header}     from "$components";
import fs                   from "node:fs";
import Path                 from "node:path";
import {useState}           from "react";
import {Bar, type BarProps} from "../bar";
import {Section}            from "./section";
import type {Data}          from "$types";
import "./styles.css";
```

---

## Exports

 * Avoid default exports except where required by a framework (e.g., Next.js page files).
 * Exports should be sorted similarly to imports.

---

## Functions and Arrow Functions

Use arrow functions **only** where they improve readability or concision:

 * Single-expression bodies → arrow, no braces:

   ```ts
   const add = (a: number, b: number) => a + b;
   ```

 * Multi-statement named functions → `function` declaration:

   ```ts
   function processData(data: Data): ProcessedData {
       const result = performCalculation(data);
       return transform(result);
   }
   ```

 * Inline / anonymous callbacks → arrow, even with multiple statements:

   ```ts
   items.map(item => {
       const a = computeA(item);
       const b = computeB(item);
       return combine(a, b);
   });
   ```

**Note that in most cases, arrow functions _should_ be used instead of `function` declarations if the function body would otherwise be a single `return` expression.**

---

## Destructuring

Keep destructuring on one line if it fits. Only wrap when necessary:

```ts
// Good
const {a, b, c} = obj;
const [x, y, z] = array;

// Only wrap when it doesn't fit on one line
const {
	longerName1,
	longerName2,
	longerName3,
} = obj;
```

Nested destructuring is acceptable inline if not too dense:

```ts
const {a: {d, e}, b: {f}} = obj;  // fine
```

---

## Literals

Object and array literals stay on one line if they fit and aren't hard to read:

```ts
const config = {host: "localhost", port: 5432};
const ids    = [1, 2, 3];
```

Wrap only when the line would exceed 100 characters or readability suffers.

---

## Nulls

Prefer `undefined` over `null` for missing values. Use `null` only when working with an API or library that specifically requires it.

---

## Abbreviations

Most abbreviations should be avoided, with the exception of very common, unambiguous ones (e.g., `id`, `props`, `args`, `params`, `ctx` for context, `obj` for object, etc.). When in doubt, spell it out.

In particular, avoid confusing abbreviations like `no` for "number". If you must abbreviate "number", consider `num` or `count` instead.

Note that single-letter variable names are not abbreviations, and are fine when their meaning is clear in context (e.g., `i` for loop index, `x` and `y` for coordinates, `e` for event, `o` for object, etc.).

But lowercase `l` should be avoided as a variable name due to its visual similarity to `1`.

---

## React / JSX

**Component Props type:**
 * Defined locally in the component file, named `Props`, not exported by default.
 * Use `ComponentProps<typeof MyComponent>` for one-off external access.
 * Only if the component's props are needed in many places or form part of another component's interface is it acceptable to give `Props` a more specific name and export it.
 * If `Props` is large, give it a name and move it to a separate file, but use a barrel file to control the public surface of the component's API. (_i.e., still don't export the props type to the world unless it's needed`).

**Destructuring props:**
 * Destructure in the parameter list only if it fits on one line.
 * Otherwise take `props: Props` and destructure in the body.

```tsx
// Short enough — destructure in params
function MyComponent({a, b, c}: Props): JSX.Element { ... }

// Too long — destructure in body
function MyComponent(props: Props): JSX.Element {
	const {prop1, prop2, prop3, prop4, prop5} = props;
	...
}

// Never wrap the parameter list destructuring — bad:
function MyComponent({
	prop1,
	prop2,
	...
}: Props): JSX.Element { ... }
```

**String props:** no curly braces for string literals:

```tsx
// Good
<Input type="text" placeholder="Search encounters" />

// Bad
<Input type={"text"} placeholder={"Search encounters"} />
```

**Wrapped props:** align on `=` (see Table Alignment).

---

## Strings and Quotes

 * Prefer **double quotes**.
 * Use **single quotes** if the string contains double quotes (and no single quotes).
 * Use **template literals** if the string contains both, or needs interpolation or multiple lines.
 * Do **not** use template literals when none of their features are needed.

```ts
const a = "hello world";
const b = 'she said "hello"';
const c = `she said "hello" and I said 'hi'`;
const d = `Hello, ${name}!`;
const e = `Line 1
Line 2`;
```

---

## CSS

### Class Names

In **CSS Modules** (`.module.css`): camelCase class names, since they're accessed as TypeScript properties:

```css
.encounterRow { ... }
.tagPill { ... }
```

In **global CSS** files: kebab-case, per convention:

```css
.encounter-row { ... }
.tag-pill { ... }
```

In both cases, consider single-word names if they suffice.

### Table Alignment in CSS

When a rule has multiple declarations, align colons — one space after the longest property name. No alignment for single-declaration rules:

```css
/* Single declaration — no alignment */
.tagPill {
	color: var(--color-accent);
}

/* Multiple declarations — align on colon, add a space after longest property name */
.encounterRow {
	display       : flex;
	align-items   : center;
	padding       : 0.75em 1em;
	border-bottom : 1px solid var(--color-border);
}
```

### Selector Wrapping

Do not wrap selectors unless necessary for line length or readability:

```css
/* Good */
.encounterRow, .tagPill { ... }

/* Bad */
.encounterRow,
.tagPill { ... }
```

### Nesting

Use CSS nesting when applicable. But as with other code, avoid deep nesting — more than a few levels is a hint to refactor.

```css
.encounterRow {
	/* styles */

	&:hover {
		/* styles */

		.tagPill {
			/* styles */
		}
	}
}
```

---

## File Organization

 * **~100 lines per file.** If a file is growing past 100 lines, it's probably doing too much — split it.
 * **Single responsibility** per file.
 * **File names:** kebab-case, matching the primary export name. (`encounter-form.tsx` exports `EncounterForm`.)
 * **Barrel files** (`index.ts`) define the public interface of a directory. Use them when a directory has a clear public/private split.
 * **Avoid barrel files** that exist only to re-export everything — they inhibit tree shaking without adding clarity.

---

## Table Alignment

Where it improves scannability, align related tokens. The rule is always: **one space after the longest item**, all others padded to match.

**Assignments:**

```ts
const short            = 1;
const mediumLength     = 2;
const longVariableName = 3;
```

**Object literals (multiline):**

```ts
const obj = {
	short            : 1,
	mediumLength     : 2,
	longPropertyName : 3,
};
```

**Imports:**

```ts
import {Alpha}       from "$alpha";
import {Beta, Gamma} from "$beta";
import {Delta}       from "delta-package";
```

**Typed parameters (multiline):**

```ts
function example(
	short             : string,
	mediumLength      : number,
	longParameterName : boolean,
): void {}
```

**JSX props (multiline only):**

```tsx
<MyComponent
	prop1       = {value1}
	longerProp2 = {value2}
	prop3       = {value3}
/>
```

No spaces around `=` when props fit on one line:

```tsx
<MyComponent prop1={value1} prop2={value2} />
```

**CSS declarations (multiline rules only — see CSS section above).**

---

## Path Aliases

The `$...` alias mappings to `src/.../*` are configured in `tsconfig.json`. Use `$...` for all non-relative imports within `src/`.

Example: `import {getCurrentUser} from "$data/auth"` rather than `../../data/auth`.

---

## Vertical Whitespace

Don't skimp on blank lines. Use single blank lines to separate logical sections within a function or block — between variable declarations and the code that uses them, between distinct steps in a process, after guard clauses, etc. This makes structure visible at a glance without having to read every line.

---

## Nesting

Avoid deep nesting. Prefer early exits, guard clauses, temporaries, and helper functions to keep code flat. More than 2–3 levels of nesting is a signal to consider a refactor.

```ts
// Bad
function example() {
	if (condition1) {
		// code
		if (condition2) {
			// code
			if (condition3) {
				// code
			}
		}
	}
}

// Good
function example() {
	if (!condition1)
		return;

	// code

	if (!condition2)
		return;

	// code

	if (!condition3)
		return;

	// code
}
```

JSX can require deeper nesting due to its structure — apply the same principle where practical, such as extracting sub-components when nesting gets unwieldy.

---

## Ternaries

Simple ternaries that fit on one line are fine. When wrapping is required, prefer the **trailing operator** style — it reads like an if-else chain and avoids the mixed-indentation problems of the leading-operator style:

```ts
return (
	condition1 ?
		someValue * someFunctionCall() + someOtherValue
	: condition2 ?
		someOtherValue * someOtherFunctionCall() + someOtherOtherValue
	: undefined
);
```

The leading-operator style is acceptable for simple two-branch ternaries:

```ts
return condition1
	? someValue * someFunctionCall()
	: undefined;
```

Avoid it for chained ternaries or when the expressions themselves wrap — the indentation becomes unworkable.

---

## Switch Statements

No curly braces around `case` bodies unless needed to limit identifier scope.

**Single-line cases:** keep on one line, table-align on the colon:

```ts
switch (value) {
	case "a"   : return 1;
	case "b"   : return 2;
	case "foo" : return 3;
	default    : return 0;
}
```

**Multi-line cases:** do not indent case labels — they sit at the same level as `switch`:

```ts
switch (value) {
case "a":
	// code
	break;
case "b":
	// code
	break;
default:
	// code
	break;
}
```

---

## Tests

Do not use `it` as a test function name. Use `test` instead. And do not try to form a sentence with the test name—just describe what the test is testing. The test runner will handle the rest.