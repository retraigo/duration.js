// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const digits = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine", 
];
const teens = [
    "",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen", 
];
const tens = [
    "",
    "ten",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety", 
];
const tenPowers = [
    "{ones}",
    "{tens}",
    "{ones} hundred and",
    "{ones} thousand,",
    "{tens}",
    "{ones} hundred and",
    "{ones} million,",
    "{tens}",
    "{ones} hundred and",
    "{ones} billion,",
    "{tens}",
    "{ones} hundred and",
    "{ones} trillion,",
    "{tens}",
    "{ones} hundred and",
    "{ones} thousand,",
    "{tens}", 
];
function getTenPower(i) {
    i = i % tenPowers.length;
    return tenPowers[i];
}
function __default(n) {
    if (n === 0) return "zero";
    const digitNumbers = n.toString().split("").map((x)=>Number(x)).reverse();
    const digitStrings = [];
    for(let i = 0; i < digitNumbers.length; ++i){
        if (getTenPower(i + 1)?.startsWith("{tens}")) {
            if (digitNumbers[i + 1] === 1) {
                digitStrings.push(`${teens[digitNumbers[i]]} ${getTenPower(i).replace(/\{ones\}\s?/, "")}`);
                ++i;
                continue;
            }
        }
        digitStrings.push(getTenPower(i).replace("{ones}", digits[digitNumbers[i]]).replace("{tens}", tens[digitNumbers[i]]));
    }
    return digitStrings.reverse().join(" ");
}
const keyList = {
    d: "days",
    h: "hours",
    m: "minutes",
    s: "seconds",
    ms: "milliseconds",
    us: "microseconds",
    ns: "nanoseconds"
};
const BaseDurationObj = {
    d: 0,
    h: 0,
    m: 0,
    s: 0,
    ms: 0,
    us: 0,
    ns: 0
};
class Duration {
    raw;
    d;
    h;
    m;
    s;
    ms;
    us;
    ns;
    constructor(timestamp = Duration.getCurrentDuration()){
        if (timestamp < 0) timestamp = 0;
        timestamp = Number(timestamp);
        this.raw = timestamp;
        this.d = Math.trunc(timestamp / 86400000);
        this.h = Math.trunc(timestamp / 3600000) % 24;
        this.m = Math.trunc(timestamp / 60000) % 60;
        this.s = Math.trunc(timestamp / 1000) % 60;
        this.ms = Math.trunc(timestamp) % 1000;
        this.us = Math.trunc(timestamp * 1000) % 1000;
        this.ns = Math.trunc(timestamp * 1000000) % 1000;
    }
    get array() {
        return [
            {
                type: "d",
                value: this.d
            },
            {
                type: "h",
                value: this.h
            },
            {
                type: "m",
                value: this.m
            },
            {
                type: "s",
                value: this.s
            },
            {
                type: "ms",
                value: this.ms
            },
            {
                type: "us",
                value: this.us
            },
            {
                type: "ns",
                value: this.ns
            }, 
        ];
    }
    get days() {
        return this.d;
    }
    get hours() {
        return this.h;
    }
    get minutes() {
        return this.m;
    }
    get seconds() {
        return this.s;
    }
    get milliseconds() {
        return this.ms;
    }
    get microseconds() {
        return this.us;
    }
    get nanoseconds() {
        return this.ns;
    }
    get µs() {
        return this.us;
    }
    get json() {
        return this.array.reduce((acc, stuff)=>(acc[stuff.type] = stuff.value, acc), BaseDurationObj);
    }
    addDays(n) {
        this.d += n;
        return this.reload();
    }
    addHours(n) {
        this.h += n;
        return this.reload();
    }
    addMinutes(n) {
        this.m += n;
        return this.reload();
    }
    addSeconds(n) {
        this.s += n;
        return this.reload();
    }
    addMilliseconds(n) {
        this.ms += n;
        return this.reload();
    }
    addMicroseconds(n) {
        this.us += n;
        return this.reload();
    }
    addNanoseconds(n) {
        this.ns += n;
        return this.reload();
    }
    asDays() {
        return this.raw / (24 * 60 * 60 * 1_000);
    }
    asHours() {
        return this.raw / (60 * 60 * 1_000);
    }
    asMinutes() {
        return this.raw / (60 * 1_000);
    }
    asSeconds() {
        return this.raw / 1_000;
    }
    asMilliseconds() {
        return this.raw;
    }
    asMicroseconds() {
        return this.raw * 1_000;
    }
    asNanoseconds() {
        return this.raw * 1_000_000;
    }
    clone() {
        return new Duration(this.raw);
    }
    getSimpleFormattedDuration() {
        return this.toString();
    }
    getFormattedDurationArray() {
        return this.array.map((x)=>[
                "ms",
                "us",
                "ns"
            ].includes(x.type) ? addZero(x.value, 3) : addZero(x.value, 2));
    }
    reload() {
        const ts = this.d * 8.64e7 + this.h * 3600000 + this.m * 60000 + this.s * 1000 + this.ms + this.us / 1000 + this.ns / 1000000;
        if (ts === this.raw) return this;
        const newDuration = new Duration(ts);
        this.d = newDuration.d;
        this.h = newDuration.h;
        this.m = newDuration.m;
        this.s = newDuration.s;
        this.ms = newDuration.ms;
        this.ns = newDuration.ns;
        this.us = newDuration.us;
        this.raw = newDuration.raw;
        return this;
    }
    setDays(n) {
        this.d = n;
        return this.reload();
    }
    setHours(n) {
        this.h = n;
        return this.reload();
    }
    setMinutes(n) {
        this.m = n;
        return this.reload();
    }
    setSeconds(n) {
        this.s = n;
        return this.reload();
    }
    setMilliseconds(n) {
        this.ms = n;
        return this.reload();
    }
    setMicroseconds(n) {
        this.us = n;
        return this.reload();
    }
    setNanoseconds(n) {
        this.ns = n;
        return this.reload();
    }
    toDescriptiveString(values = []) {
        if (!Array.isArray(values) || values.length == 0) {
            return `${this.array.map((x)=>`${x.value} ${keyList[x.type]}`).join(", ")}`;
        }
        return `${this.array.filter((x)=>values.includes(x.type)).map((x)=>`${x.value} ${keyList[x.type]}`).join(", ")}`;
    }
    toJSON() {
        return this.json;
    }
    toShortString(values = []) {
        if (!Array.isArray(values) || values.length == 0) {
            return `${this.array.map((x)=>`${x.value}${x.type}`).join(" ")}`;
        }
        return `${this.array.filter((x)=>values.includes(x.type)).map((x)=>`${x.value}${x.type}`).join(" ")}`;
    }
    toString() {
        return `${this.getFormattedDurationArray().join(":")}`;
    }
    toTimeString(fromT = "d", toT = "ns") {
        if (typeof fromT !== "string" || typeof toT !== "string" || !Object.prototype.hasOwnProperty.call(keyList, fromT.toLowerCase()) || !Object.prototype.hasOwnProperty.call(keyList, toT.toLowerCase())) {
            return this.getSimpleFormattedDuration();
        }
        const durations = this.getFormattedDurationArray();
        const listOfKeys = Object.keys(keyList);
        return durations.slice(listOfKeys.indexOf(fromT), listOfKeys.indexOf(toT) + 1).join(":");
    }
    toWordString(values = []) {
        if (!Array.isArray(values) || values.length === 0) {
            return `${this.array.map((x)=>`${__default(x.value).trim()} ${keyList[x.type]}`).join(", ")}`;
        }
        if (values.length > 0) {
            return `${this.array.filter((x)=>values.includes(x.type)).map((x)=>`${__default(x.value).trim()} ${keyList[x.type]}`).join(", ")}`;
        }
        return `${this.array.map((x)=>`${__default(x.value).trim()} ${keyList[x.type]}`).join(", ")}`;
    }
    valueOf() {
        return this.raw;
    }
    static between(duration1, duration2) {
        let myDuration1, myDuration2;
        if (duration1 instanceof Duration) myDuration1 = duration1;
        else if (typeof duration1 === "string") {
            if (isNaN(+duration1)) myDuration1 = Duration.fromString(duration1);
            else myDuration1 = new Duration(+duration1);
        } else if (typeof duration1 === "number") {
            myDuration1 = new Duration(duration1);
        } else if (duration1 instanceof Date) {
            myDuration1 = new Duration(duration1.getTime());
        } else myDuration1 = new Duration();
        if (duration2 instanceof Duration) myDuration2 = duration2;
        else if (typeof duration2 === "string") {
            if (isNaN(+duration2)) myDuration2 = Duration.fromString(duration2);
            else myDuration2 = new Duration(+duration2);
        } else if (typeof duration2 === "number") {
            myDuration2 = new Duration(duration2);
        } else if (duration2 instanceof Date) {
            myDuration2 = new Duration(duration2.getTime());
        } else myDuration2 = new Duration();
        return new Duration(myDuration1.raw > myDuration2.raw ? myDuration1.raw - myDuration2.raw : myDuration2.raw - myDuration1.raw);
    }
    static fromString(str, doNotParse = false) {
        const { raw , d , h , m , s , ms , ns , us  } = Duration.readString(str);
        const ts = raw;
        const newDuration = new Duration(ts);
        if (doNotParse) {
            newDuration.d = d;
            newDuration.h = h;
            newDuration.m = m;
            newDuration.s = s;
            newDuration.ms = ms;
            newDuration.ns = ns;
            newDuration.us = us;
        }
        return newDuration;
    }
    static getCurrentDuration() {
        return Date.now() - new Date().setHours(0, 0, 0, 0);
    }
    static readString(str) {
        str = str.replace(/\s\s/g, "");
        const days = matchUnit(str, "d") || matchUnit(str, "days") || matchUnit(str, "day");
        const hours = matchUnit(str, "h") || matchUnit(str, "hours") || matchUnit(str, "hour");
        const minutes = matchUnit(str, "m") || matchUnit(str, "min") || matchUnit(str, "minute") || matchUnit(str, "mins") || matchUnit(str, "minutes");
        const seconds = matchUnit(str, "s") || matchUnit(str, "sec") || matchUnit(str, "second") || matchUnit(str, "secs") || matchUnit(str, "seconds");
        const milliseconds = matchUnit(str, "ms") || matchUnit(str, "millisecond") || matchUnit(str, "milliseconds");
        const nanoseconds = matchUnit(str, "ns") || matchUnit(str, "nanosecond") || matchUnit(str, "nanoseconds");
        const microseconds = matchUnit(str, "µs") || matchUnit(str, "microsecond") || matchUnit(str, "microseconds") || matchUnit(str, "us");
        return {
            raw: days * 8.64e7 + hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds + microseconds / 1000 + nanoseconds / 1000000,
            d: days,
            h: hours,
            m: minutes,
            s: seconds,
            ms: milliseconds,
            ns: nanoseconds,
            us: microseconds
        };
    }
    static since(when) {
        return Duration.between(when instanceof Date ? when.getTime() : when, Date.now());
    }
}
function matchUnit(str, t) {
    const reg = new RegExp(`(\\d+)\\s?${t}(?:[^a-z]|$)`, "i");
    const matched = reg.exec(str);
    if (!matched) return 0;
    return parseInt(matched[1].replace(t, ""));
}
function addZero(num, digits = 3) {
    const arr = new Array(digits).fill(0);
    return `${arr.join("").slice(0, 0 - num.toString().length)}${num}`;
}
export { Duration as Duration };
export { matchUnit as matchUnit };
export { addZero as addZero };
export { Duration as default };
