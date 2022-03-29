// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

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
    raw: 0,
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
                value: this.µs
            },
            {
                type: "ns",
                value: this.ns
            }, 
        ];
    }
    get µs() {
        return this.us;
    }
    get json() {
        return this.array.reduce((acc, stuff)=>(acc[stuff.type] = stuff.value, acc)
        , BaseDurationObj);
    }
    stringify(values = [], shortandsweet = false) {
        if (!Array.isArray(values) || values.length == 0) {
            if (!shortandsweet || typeof shortandsweet !== "boolean") {
                return `${this.array.map((x)=>`${x.value} ${keyList[x.type]}`
                ).join(", ")}`;
            }
            return `${this.array.map((x)=>`${x.value}${x.type}`
            ).join(" ")}`;
        }
        if (values.length > 0) {
            if (!shortandsweet || typeof shortandsweet !== "boolean") {
                return `${this.array.filter((x)=>values.includes(x.type)
                ).map((x)=>`${x.value} ${keyList[x.type]}`
                ).join(", ")}`;
            }
            return `${this.array.filter((x)=>values.includes(x.type)
            ).map((x)=>`${x.value}${x.type}`
            ).join(" ")}`;
        }
        return `${this.array.map((x)=>`${x.value} ${keyList[x.type]}`
        ).join(", ")}`;
    }
    getFormattedDuration(fromT = "d", toT = "us") {
        if (typeof fromT !== "string" || typeof toT !== "string" || !Object.hasOwn(keyList, fromT.toLowerCase()) || !Object.hasOwn(keyList, toT.toLowerCase())) {
            return this.getSimpleFormattedDuration();
        }
        const durations = [];
        const next = this.array[this.array.findIndex((x)=>x.type === toT.toLowerCase()
        ) + 1];
        for (const obj of this.array){
            if (obj.type !== fromT.toLowerCase() && durations.length === 0) continue;
            if (!next) break;
            if (obj.type === next.type) break;
            durations.push(obj.value);
        }
        return durations.join(":");
    }
    getSimpleFormattedDuration() {
        return `${this.array.map((x)=>x.value
        ).join(":")}`;
    }
    toString() {
        return `[Duration ${this.stringify([
            "d",
            "h",
            "m",
            "s"
        ], true)}]`;
    }
    reload() {
        const ts = this.d * 86400000 + this.h * 3600000 + this.m * 60000 + this.s * 1000 + this.ms + this.us / 1000 + this.ns / 1000000;
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
    static fromString(str, doNotParse = false) {
        const { d , h , m , s , ms , ns , us  } = Duration.readString(str);
        const ts = d * 86400000 + h * 3600000 + m * 60000 + s * 1000 + ms + us / 1000 + ns / 1000000;
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
        return new Date().setHours(0, 0, 0, 0);
    }
    static readString(str) {
        str = str.replace(/\s\s/g, "");
        const days = matchReg(str, "d") || matchReg(str, "days") || matchReg(str, "day");
        const hours = matchReg(str, "h") || matchReg(str, "hours") || matchReg(str, "hour");
        const minutes = matchReg(str, "m") || matchReg(str, "min") || matchReg(str, "minute") || matchReg(str, "mins") || matchReg(str, "minutes");
        const seconds = matchReg(str, "s") || matchReg(str, "sec") || matchReg(str, "second") || matchReg(str, "secs") || matchReg(str, "seconds");
        const milliseconds = matchReg(str, "ms") || matchReg(str, "millisecond") || matchReg(str, "milliseconds");
        const nanoseconds = matchReg(str, "ns") || matchReg(str, "nanosecond") || matchReg(str, "nanoseconds");
        const microseconds = matchReg(str, "µs") || matchReg(str, "microsecond") || matchReg(str, "microseconds");
        matchReg(str, "us");
        return {
            d: days,
            h: hours,
            m: minutes,
            s: seconds,
            ms: milliseconds,
            ns: nanoseconds,
            us: microseconds
        };
    }
}
function matchReg(str, t) {
    const reg = new RegExp(`(\\d+)\\s?${t}(?:[^a-z]|$)`, "i");
    const matched = reg.exec(str);
    if (!matched) return 0;
    return parseInt(matched[1].replace(t, ""));
}
export { matchReg as MatchUnit };
export { Duration as Duration };
export { Duration as default };