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
 console.log(Duration.fromString("5 m s 54h 5d 44 s").stringify([], true))
