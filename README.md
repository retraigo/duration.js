# duration.js

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
import Duration from "https://deno.land/x/durationjs@v2.0.0/index.js"; 

const Duration = await import("@retraigo/duration.js"); // Node with CommonJS

new Duration(); // Get duration since midnight

new Duration(3545346); // A random duration

new Duration(0); // Just 0

new Duration(-1); // Negative duration returns 0 too
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
};
```

### Methods

#### toString()

`toString()` returns a simplified version of `stringify()` despite not looking nice at all. Simply exists.

```js
new Duration(261174).toString();
// `[Duration 0d 0h 4m 21s]`
```

#### stringify([values] [,short])

`stringify()` returns a formatted string of the duration object. It has two optional parameters.
`values` - An array of values to include. Should be one of `['d', 'h', 'm', 's', 'ms']`. Defaults to the array I mentioned a few words ago.
`short` - `true` if the function should return letters instead of words (I suck at explaining). Defaults to false.

```js
new Duration(165684).stringify();
// `0 days, 0 hours, 2 minutes, 45 seconds, 684 milliseconds`
new Duration(165684).stringify(["s", "h"]);
// `0 hours, 45 seconds`
new Duration(165684).stringify(["s", "h"], true);
// `0h 45s`
```

#### getFormattedDuration([from] [,to])

`getFormattedDuration()` returns a formatted string of the duration object in the `d:h:m:s:ms` format. It has two optional parameters.
`from` - The value to begin with. Should be one of `['d', 'h', 'm', 's', 'ms']`. Defaults to `'d'`.
`to` - The value to end with. Should be one of `['d', 'h', 'm', 's', 'ms']`. Defaults to `'ms'`.

```js
new Duration(165684).getFormattedDuration();
// `0:0:2:45:684`
new Duration(165684).getFormattedDuration("h", "s");
// `0:2:45`
new Duration(165684).getFormattedDuration("s", "h");
// `45:684`
// ignores the `to` parameter if it is larger than the `from` parameter
```

#### getSimpleFormattedDuration()

`getSimpleFormattedDuration()` returns a formatted string of the duration object in the `d:h:m:s:ms` format.

```js
new Duration(165684).getSimpleFormattedDuration();
// `0:0:2:45:684`
```

#### get json()

Returns a JavaScript object version of the class with just the main stuff.

```js
new Duration(114750).json;
// `{ d: 0, h: 0, m: 1, s: 54, ms: 750 }`
```

#### get array()

Returns an array of objects with type and value.

```js
new Duration(245074).array;
/* 
   [
       { type: 'd', value: 0 },
       { type: 'h', value: 0 },
       { type: 'm', value: 4 },
       { type: 's', value: 5 },
       { type: 'ms', value: 74 }
   ]
*/
```

### Support
Join our Discord server for updates on this package and any other packages by me.
[Discord](https://discord.gg/Erf8yj3JP5)