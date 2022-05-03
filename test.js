import {Duration} from "./mod.ts";

/*
const dur = new Duration(177013); // A random duration

console.log(dur);
console.log(new Duration(261174).toString());

console.log(new Duration(165684).stringify());
console.log(new Duration(165684).stringify(["s", "h"]));

console.log(new Duration(114750).json);

console.log(new Duration(245074).array);
const a = new Duration(0)
console.log(a.setHours(10))
console.log(a.setMicroseconds(34344334))
console.log(a.addMinutes(100))


*/

const a = new Duration(0).setHours(10).setMicroseconds(34344334).addMinutes(100)
const b = new Duration(0).setHours(13).setMicroseconds(3434344334).addMinutes(160)

console.log(b.raw, a.raw, b.raw - a.raw, b - a, Duration.between(b - a), new Duration(b - a), b > a, a > b)


/*
const d = new Duration(6000.4353262);
console.log(d.µs)
d.m += 70;
console.log(d); // Only d.m changes. d.h remains the same
d.reload();
console.log(d); // d.m turns into 10 and d.h turns into 1
*/