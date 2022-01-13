# duration.js

Get the formated time duration

## Installation

```bash
$ npm install --save @retraigo/duration.js # NPM
$ pnpm install @retraigo/duration.js # PNPM
```

## Usage

### Basic Usage

```js
const Duration = require("@retraigo/duration.js");

console.log(new Duration()); // Get duration since midnight

console.log(new Duration(3545346)); // A random duration

console.log(new Duration(0)); // Just 0

console.log(new Duration(-1)); // Negative duration returns 0 too
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
new Duration(165684).stringify(['s', 'h']);
// `0 hours, 45 seconds`
new Duration(165684).stringify(['s', 'h'], true);
// `0h 45s`

```

#### get json()
Returns a JSON version of the class with just the main stuff.
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
