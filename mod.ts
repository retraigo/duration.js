interface KeyList {
  d: string;
  h: string;
  m: string;
  s: string;
  ms: string;
  us: string;
  ns: string;
}
const keyList: KeyList = {
  d: "days",
  h: "hours",
  m: "minutes",
  s: "seconds",
  ms: "milliseconds",
  us: "microseconds",
  ns: "nanoseconds",
};

export type DurationKeys = "d" | "h" | "m" | "s" | "ms" | "us" | "ns";

/**
 * For the array of values
 * @typedef {object} KeyValue
 * @property {string} type - Type of key. One of d, h, m, s, ms, us, ns
 * @property {number} value - Value of the time unit
 */
export interface KeyValue {
  type: DurationKeys;
  value: number;
}

/**
 * Duration Object
 * @typedef {Object} DurationObj
 * @property {number} raw - Total number of milliseconds in the duration
 * @property {number} d - Number of days held by duration
 * @property {number} h - Number of hours held by duration
 * @property {number} m - Number of minutes held by duration
 * @property {number} s - Number of seconds held by duration
 * @property {number} ms - Number of milliseconds held by duration
 * @property {number} us - Number of microseconds held by duration
 * @property {number} ns - Number of nanoseconds held by duration
 */
export interface DurationObj {
  raw: number;
  d: number;
  h: number;
  m: number;
  s: number;
  ms: number;
  us: number;
  ns: number;
}

const BaseDurationObj: DurationObj = {
  raw: 0,
  d: 0,
  h: 0,
  m: 0,
  s: 0,
  ms: 0,
  us: 0,
  ns: 0,
};

/**
 * A simple JavaScript class used to parse time durations
 * @module Duration
 * @class
 */

export class Duration {
  raw: number;
  d: number;
  h: number;
  m: number;
  s: number;
  ms: number;
  us: number;
  ns: number;
  /**
   * Create a new Duration
   * @param {number} timestamp - Duration in milliseconds
   * @returns {<Duration>}
   */
  constructor(timestamp: number = Duration.getCurrentDuration()) {
    if (timestamp < 0) timestamp = 0; // Prevent negative time
    this.raw = timestamp;
    this.d = Math.trunc(timestamp / 86400000);
    this.h = Math.trunc(timestamp / 3600000) % 24;
    this.m = Math.trunc(timestamp / 60000) % 60;
    this.s = Math.trunc(timestamp / 1000) % 60;
    this.ms = Math.trunc(timestamp) % 1000;
    this.us = Math.trunc(timestamp * 1000) % 1000;
    this.ns = Math.trunc(timestamp * 1000000) % 1000;
  }
  /**
   * Data in the class mapped into an Array with properties "type" and "value"
   * @returns {KeyValue[]}
   */
  get array(): KeyValue[] {
    return [
      { type: "d", value: this.d },
      { type: "h", value: this.h },
      { type: "m", value: this.m },
      { type: "s", value: this.s },
      { type: "ms", value: this.ms },
      { type: "us", value: this.µs },
      { type: "ns", value: this.ns },
    ];
  }
  /**
   * Alt way to get microseconds
   */
  get µs(): number {
    return this.us;
  }
  /**
   * Data in the class mapped as a JavaScript Object.
   * @returns {DurationObj}
   */
  get json(): DurationObj {
    return this.array.reduce(
      (acc, stuff) => ((acc[stuff.type] = stuff.value), acc),
      BaseDurationObj,
    );
  }
  /**
   * @param {string[]} values - The values required to display
   * @param {boolean} shortandsweet - If response should be a short string.
   * @returns {string} formatted string - The formatted string result
   */
  stringify(values: string[] = [], shortandsweet = false): string {
    if (!Array.isArray(values) || values.length == 0) {
      if (
        !shortandsweet ||
        typeof shortandsweet !== "boolean"
      ) {
        return `${
          this.array
            .map((x) => `${x.value} ${keyList[x.type]}`)
            .join(", ")
        }`;
      }
      return `${this.array.map((x) => `${x.value}${x.type}`).join(" ")}`;
    }
    if (values.length > 0) {
      if (
        !shortandsweet ||
        typeof shortandsweet !== "boolean"
      ) {
        return `${
          this.array
            .filter((x) => values.includes(x.type))
            .map((x) => `${x.value} ${keyList[x.type]}`)
            .join(", ")
        }`;
      }
      return `${
        this.array
          .filter((x) => values.includes(x.type))
          .map((x) => `${x.value}${x.type}`)
          .join(" ")
      }`;
    }
    return `${
      this.array
        .map((x) => `${x.value} ${keyList[x.type]}`)
        .join(", ")
    }`;
  }
  /**
   * Get a duration formatted using colons (:)
   * @param {string} fromT - Unit to display from
   * @param {string} toT - Unit to display upto
   * @returns {string} Formatted string
   */
  getFormattedDuration(
    fromT: DurationKeys = "d",
    toT: DurationKeys = "us",
  ): string {
    if (
      typeof fromT !== "string" ||
      typeof toT !== "string" ||
      !Object.hasOwn(keyList, fromT.toLowerCase()) ||
      !Object.hasOwn(keyList, toT.toLowerCase())
    ) {
      return this.getSimpleFormattedDuration();
    }
    const durations = [];
    const next =
      this.array[this.array.findIndex((x) => x.type === toT.toLowerCase()) + 1];
    for (const obj of this.array) {
      if (obj.type !== fromT.toLowerCase() && durations.length === 0) continue;
      if (!next) break;
      if (obj.type === next.type) break;
      durations.push(obj.value);
    }
    return durations.join(":");
  }
  /**
   * Get a simple formatted duration in the form dd:hh:mm:ss:ms
   * @returns {string} Formatted string
   */
  getSimpleFormattedDuration(): string {
    return `${this.array.map((x) => x.value).join(":")}`;
  }
  /**
   * Extra filler function that returns the class data in a single short string.
   * @returns {string} Dumb string
   */
  toString(): string {
    return `[Duration ${this.stringify(["d", "h", "m", "s"], true)}]`;
  }
  /**
   * Updated data to match any modification to values.
   * @returns {<Duration>}
   */
  reload(): Duration {
    const ts = this.d * 8.64e7 +
      this.h * 3600000 +
      this.m * 60000 +
      this.s * 1000 +
      this.ms + (this.us / 1000) + (this.ns / 1000000);
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
  /**
   * Reads a given string and parses a duration from it.
   * @param {string} str - A string which could contain a duration
   * @param {string} doNotParse - Directly return the values read
   * @returns {<Duration>}
   */
  static fromString(str: string, doNotParse = false): Duration {
    const { d, h, m, s, ms, ns, us } = Duration.readString(str);
    const ts = d * 8.64e7 + h * 3600000 + m * 60000 + s * 1000 + ms +
      (us / 1000) +
      (ns / 1000000);

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
  /**
   * Get the duration till next midnight in milliseconds.
   * @returns {number} Duration in milliseconds till the next midnight
   */
  static getCurrentDuration(): number {
    return new Date().setHours(0, 0, 0, 0);
  }
  /**
   * Read duration data from a string.
   * @param {string} str - The string to read
   * @returns {DurationObj} obj - Object with days, hours, mins, seconds and milliseconds
   */
  static readString(str: string) {
    str = str.replace(/\s\s/g, "");
    const days = matchReg(str, "d") || matchReg(str, "days") ||
      matchReg(str, "day");
    const hours = matchReg(str, "h") || matchReg(str, "hours") ||
      matchReg(str, "hour");
    const minutes = matchReg(str, "m") ||
      matchReg(str, "min") ||
      matchReg(str, "minute") ||
      matchReg(str, "mins") ||
      matchReg(str, "minutes");
    const seconds = matchReg(str, "s") ||
      matchReg(str, "sec") ||
      matchReg(str, "second") ||
      matchReg(str, "secs") ||
      matchReg(str, "seconds");
    const milliseconds = matchReg(str, "ms") ||
      matchReg(str, "millisecond") ||
      matchReg(str, "milliseconds");
    const nanoseconds = matchReg(str, "ns") ||
      matchReg(str, "nanosecond") ||
      matchReg(str, "nanoseconds");
    const microseconds = matchReg(str, "µs") ||
      matchReg(str, "microsecond") ||
      matchReg(str, "microseconds");
    matchReg(str, "us");
    return {
      d: days,
      h: hours,
      m: minutes,
      s: seconds,
      ms: milliseconds,
      ns: nanoseconds,
      us: microseconds,
    };
  }
}

/**
 * Match a unit in a string. Like "1kg", "3L", etc.
 * @param {string} str - String to match from
 * @param {string} t - Unit to look for. Doesn't support aliases.
 * @returns {number} value - Value of the unit matched
 */
function matchReg(str: string, t: string): number {
  const reg = new RegExp(`(\\d+)\\s?${t}(?:[^a-z]|$)`, "i");
  const matched = reg.exec(str);
  if (!matched) return 0;
  return parseInt(matched[1].replace(t, ""));
}

// module.exports = Duration;

export default Duration;
export { matchReg as MatchUnit };