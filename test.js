import Duration from "./index.js";

/*
const dur = new Duration(177013); // A random duration

console.log(dur);
console.log(new Duration(261174).toString());

console.log(new Duration(165684).stringify());
console.log(new Duration(165684).stringify(["s", "h"]));

console.log(new Duration(114750).json);

console.log(new Duration(245074).array);

*/
// console.log(Duration.fromString("5 m s 54h 5d 44 s").stringify([], true))

const d = new Duration(6000);
d.m += 70
console.log(d) // Only d.m changes. d.h remains the same
d.reload()
console.log(d) // d.m turns into 10 and d.h turns into 1
