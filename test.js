import { Duration } from "./duration.js"

console.debug(`Testing duration with Normal number`, new Duration(923))

console.debug(`Testing duration with 0`, new Duration(0))

console.debug(`Testing duration with BigInt`, new Duration(BigInt(923)))

console.debug(`Testing duration with Negative number`, new Duration(-923))

console.debug(`Starting to test speed...`)
console.time("Speed Test")
const a = new Duration(0);
console.timeLog("Speed Test", "Initiated Duration", "-", `${performance.now()}ms`)
for(let i = 0; i < 1000000; ++i) {
    a.addSeconds(1);
}
console.timeLog("Speed Test", "Ran addSeconds 1000000 times.", "-", `${performance.now()}ms`)
const b = a.clone()
console.timeLog("Speed Test", "Cloned the duration.", "-", `${performance.now()}ms`)
console.timeEnd("Speed Test", "-", `${performance.now()}ms`)
console.debug("Stringifying Test:", "Words:", b.stringify())
console.debug("Stringifying Test:", "Short:", b.stringify([], true));
console.debug("Stringifying Test:", "Shorter:", b.toString())

console.debug("Parsing Test:", JSON.stringify(b))