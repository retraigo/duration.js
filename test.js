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
console.log(Duration.fromString("4090 sec 4939  days 7342  hour 2324milliseconds 4344 min").stringify(["m", "s"]))