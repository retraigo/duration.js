# duration.js
Get the formated time duration

## Usage
```js
const Duration = require('duration.js')

console.log(new Duration()) // Get duration since midnight

console.log(new Duration(3545346)) // A random duration

console.log(new Duration(0)) // Just 0

console.log(new Duration(-1)) // Negative duration returns 0 too
```
