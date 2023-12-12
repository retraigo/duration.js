# duration.js
**For a lighter and simpler version, check out [nekooftheabyss/denouse](https://github.com/nekooftheabyss/denouse)

## Documentation
Check out [Neko Of The Abyss](https://docs.nekooftheabyss.moe/duration) for documentation.

Duration follows the `performance.now()` format, so microseconds and nanoseconds go after the decimal point.

## Installation

```bash
$ npm install --save @retraigo/duration.js # NPM
$ pnpm install @retraigo/duration.js # PNPM
```

## Usage

### Basic Usage

```js
// Node
import Duration from "@retraigo/duration.js"; 
// Deno
import Duration from "https://deno.land/x/durationjs@v4.0.0/mod.ts"; 

const Duration = await import("@retraigo/duration.js"); // Node with CommonJS

new Duration(); // Get duration since midnight

new Duration(3545346); // A random duration

new Duration(0); // Just 0

new Duration(-1); // Negative duration returns 0 too
```

### Duration since a timestamp
```ts
const start = performance.now()
// Do some long task
const d = Duration.since(start)
```

### Duration between two timestamps
```ts
const start = performance.now()
// Do some long task
const check = performance.now()
const d = Duration.between(start, check)
```

### From Text

```js
Duration.fromString("1m2s"); // Duration {d:0, h:0, m:1, s:2, ms:0}

Duration.fromString("4090 sec 4939  days 7342  hour 2324milliseconds 4344 min"); // // Duration {d: 5246, h: 13, m: 52, s: 12, ms: 324 }
```

You can also get the entire Duration in milliseconds through the `raw` property.

```js
const dur = Duration.fromString(
  "4090 sec 4939  days 7342  hour 2324milliseconds 4344 min"
);
dur.raw; // 453304332324
```

### Properties

```js
Duration {
    raw: 0 // Original milliseconds passed to the constructor
    d: 0, // Days
    h: 0, // Hours
    m: 0, // Minutes
    s: 0, // Seconds
    ms: 0 // Milliseconds
    us: 0 // Microseconds
    ns: 0 // Nanoseconds
};
```

### Formatting

```ts
const duration = new Duration(59834344.334)

console.log(duration)
// Duration { raw: 59834344.334, d: 0, h: 16, m: 37, s: 14, ms: 344, us: 334, ns: 0 }
console.log(duration.toDescriptiveString())
// 0 days, 16 hours, 37 minutes, 14 seconds, 344 milliseconds, 334 microseconds, 0 nanoseconds
console.log(duration.toShortString())
// 0d 16h 37m 14s 344ms 334us 0ns
console.log(duration.toWordString())
// zero days, sixteen hours, thirty seven minutes, fourteen seconds, 
// three hundred and forty four milliseconds, three hundred and thirty 
// four microseconds, zero nanoseconds
console.log(duration.toTimeString())
// 00:16:37:14:344:334:000
```


## Changes from V3

- `Duration.prototype.stringify` has been removed in favor of:
  - `Duration.prototype.toDescriptiveString`
  - `Duration.prototype.toWordString`
  - `Duration.prototype.toShortString`
  - `Duration.prototype.toTimeString`
- `addZero` has been removed. Use the built-in `String.prototype.padStart(n, "0")` instead.
- `matchReg` has been renamed to `matchUnit`.

## Support
Join our Discord server [here](https://discord.gg/A69vvdK)