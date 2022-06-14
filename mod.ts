import InWords from "./in_words.ts";

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

/**
 * @typedef {string} DurationKeys - Units of time.
 */
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
   * Parse milliseconds into separate units of time.
   * @param {number} timestamp - Milliseconds to parse into a duration object.
   * @returns {<Duration>}
   */
  constructor(timestamp: number = Duration.getCurrentDuration()) {
    if (timestamp < 0) timestamp = 0; // Prevent negative time
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
  /**
   * An array of time units and their values.
   * @returns {KeyValue[]}
   */
  get array(): KeyValue[] {
    return [
      { type: "d", value: this.d },
      { type: "h", value: this.h },
      { type: "m", value: this.m },
      { type: "s", value: this.s },
      { type: "ms", value: this.ms },
      { type: "us", value: this.us },
      { type: "ns", value: this.ns },
    ];
  }
  /**
   * Alias for microseconds.
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
   * Add more days to the duration.
   * @param {number} n - Number of days to add.
   * @returns {Duration} The updated duration.
   */
  addDays(n: number): Duration {
    this.d += n;
    return this.reload();
  }
  /**
   * Add more hours to the duration.
   * @param {number} n - Number of hours to add.
   * @returns {Duration} The updated duration.
   */
  addHours(n: number): Duration {
    this.h += n;
    return this.reload();
  }
  /**
   * Add more minutes to the duration.
   * @param {number} n - Number of minutes to add.
   * @returns {Duration} The updated duration.
   */
  addMinutes(n: number): Duration {
    this.m += n;
    return this.reload();
  }
  /**
   * Add more seconds to the duration.
   * @param {number} n - Number of seconds to add.
   * @returns {Duration} The updated duration.
   */
  addSeconds(n: number): Duration {
    this.s += n;
    return this.reload();
  }
  /**
   * Add more milliseconds to the duration.
   * @param {number} n - Number of milliseconds to add.
   * @returns {Duration} The updated duration.
   */
  addMilliseconds(n: number): Duration {
    this.ms += n;
    return this.reload();
  }
  /**
   * Add more microseconds to the duration.
   * @param {number} n - Number of microseconds to add.
   * @returns {Duration} The updated duration.
   */
  addMicroseconds(n: number): Duration {
    this.us += n;
    return this.reload();
  }
  /**
   * Add more nanoseconds to the duration.
   * @param {number} n - Number of nanoseconds to add.
   * @returns {Duration} The updated duration.
   */
  addNanoseconds(n: number): Duration {
    this.ns += n;
    return this.reload();
  }
  /**
   * Clone current duration (run Duration#reload before this if you manually tweaked the properties).
   * @returns {Duration} cloned duration
   */
  clone(): Duration {
    return new Duration(this.raw);
  }
  /**
   * Get a simple formatted duration in the form dd:hh:mm:ss:ms (Deprecated. Use Duration#toString())
   * @returns {string} Formatted string
   */
  getSimpleFormattedDuration(): string {
    return this.toString();
  }
  getFormattedDurationArray(): string[] {
    return this.array.map((x) =>
      ["ms", "us", "ns"].includes(x.type)
        ? addZero(x.value, 3)
        : addZero(x.value, 2)
    );
  }
  /**
   * Update data to match any modification to values.
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
   * Set days of the duration.
   * @param {number} n - Number of days to set.
   * @returns {Duration} The updated duration.
   */
  setDays(n: number): Duration {
    this.d = n;
    return this.reload();
  }
  /**
   * Set hours of the duration.
   * @param {number} n - Number of hours to set.
   * @returns {Duration} The updated duration.
   */
  setHours(n: number): Duration {
    this.h = n;
    return this.reload();
  }
  /**
   * Set minutes of the duration.
   * @param {number} n - Number of minutes to set.
   * @returns {Duration} The updated duration.
   */
  setMinutes(n: number): Duration {
    this.m = n;
    return this.reload();
  }
  /**
   * Set seconds of the duration.
   * @param {number} n - Number of seconds to set.
   * @returns {Duration} The updated duration.
   */
  setSeconds(n: number): Duration {
    this.s = n;
    return this.reload();
  }
  /**
   * Set milliseconds of the duration.
   * @param {number} n - Number of milliseconds to set.
   * @returns {Duration} The updated duration.
   */
  setMilliseconds(n: number): Duration {
    this.ms = n;
    return this.reload();
  }
  /**
   * Set microseconds of the duration.
   * @param {number} n - Number of microseconds to set.
   * @returns {Duration} The updated duration.
   */
  setMicroseconds(n: number): Duration {
    this.us = n;
    return this.reload();
  }
  /**
   * Set nanoseconds of the duration.
   * @param {number} n - Number of nanoseconds to set.
   * @returns {Duration} The updated duration.
   */
  setNanoseconds(n: number): Duration {
    this.ns = n;
    return this.reload();
  }
  /**
   * Get a formatted, human-readable string of the duration.
   * @param {string[]} values - The values required to display.
   * @returns {string} formatted string - The formatted string result.
   */
  toDescriptiveString(values: string[] | null = []): string {
    if (!Array.isArray(values) || values.length == 0) {
      return `${
        this.array.map((x) => `${x.value} ${keyList[x.type]}`).join(", ")
      }`;
    }
    return `${
      this.array
        .filter((x) => values.includes(x.type))
        .map((x) => `${x.value} ${keyList[x.type]}`)
        .join(", ")
    }`;
  }
  /**
   * Convert the Duration into a plain object.
   * @returns {DurationObj} Duration object
   */
  toJSON(): DurationObj {
    return this.json;
  }
  /**
   * Get a formatted, human-readable string of the duration.
   * @param {string[]} values - The values required to display.
   * @returns {string} formatted string - The formatted string result.
   */
  toShortString(values: string[] | null = []): string {
    if (!Array.isArray(values) || values.length == 0) {
      return `${this.array.map((x) => `${x.value}${x.type}`).join(" ")}`;
    }
    return `${
      this.array
        .filter((x) => values.includes(x.type))
        .map((x) => `${x.value}${x.type}`)
        .join(" ")
    }`;
  }
  /**
   * Get a simple formatted duration in the form dd:hh:mm:ss:ms
   * @returns {string} Formatted string
   */
  toString(): string {
    return `${this.getFormattedDurationArray().join(":")}`;
  }
  /**
   * Get a duration formatted using colons (:).
   * @param {string} fromT - Unit to display from.
   * @param {string} toT - Unit to display upto.
   * @returns {string} Formatted string.
   */
  toTimeString(
    fromT: DurationKeys = "d",
    toT: DurationKeys = "ns",
  ): string {
    if (
      typeof fromT !== "string" ||
      typeof toT !== "string" ||
      !Object.prototype.hasOwnProperty.call(keyList, fromT.toLowerCase()) ||
      !Object.prototype.hasOwnProperty.call(keyList, toT.toLowerCase())
    ) {
      return this.getSimpleFormattedDuration();
    }
    const durations = this.getFormattedDurationArray();
    const listOfKeys = Object.keys(keyList);
    return durations.slice(
      listOfKeys.indexOf(fromT),
      listOfKeys.indexOf(toT) + 1,
    ).join(":");
  }
  /**
   * Get a human-readable string of the duration in words.
   * @param {string[]} values - The values required to display.
   * @returns {string} formatted string - The formatted string result.
   */
  toWordString(values: string[] | null = []): string {
    if (!Array.isArray(values) || values.length === 0) {
      return `${
        this.array
          .map((x) => `${InWords(x.value).trim()} ${keyList[x.type]}`)
          .join(", ")
      }`;
    }
    if (values.length > 0) {
      return `${
        this.array
          .filter((x) => values.includes(x.type))
          .map((x) => `${InWords(x.value).trim()} ${keyList[x.type]}`)
          .join(", ")
      }`;
    }
    return `${
      this.array
        .map((x) => `${InWords(x.value).trim()} ${keyList[x.type]}`)
        .join(", ")
    }`;
  }

  /**
   * Just the valueOf method.
   * @returns {number} Raw milliseconds of the duration
   */
  valueOf(): number {
    return this.raw;
  }
  /**
   * Get the duration between two timestamps or two other durations.
   * @param {string|number|Duration} duration1 - Duration/Timestamp to find duration from.
   * @param {string|number|Duration} duration2 - Duration/Timestamp to find duration upto.
   * @returns {Duration} New duration between the two specified durations.
   */
  static between(
    duration1: string | number | Duration,
    duration2: string | number | Duration | undefined | null,
  ): Duration {
    let myDuration1: Duration, myDuration2: Duration;
    // Duration 1
    if (duration1 instanceof Duration) myDuration1 = duration1;
    else if (typeof duration1 === "string") {
      if (isNaN(+duration1)) myDuration1 = Duration.fromString(duration1);
      else myDuration1 = new Duration(+duration1);
    } else if (typeof duration1 === "number") {
      myDuration1 = new Duration(duration1);
    } else myDuration1 = new Duration();
    // Duration 2
    if (duration2 instanceof Duration) myDuration2 = duration2;
    else if (typeof duration2 === "string") {
      if (isNaN(+duration2)) myDuration2 = Duration.fromString(duration2);
      else myDuration2 = new Duration(+duration2);
    } else if (typeof duration2 === "number") {
      myDuration2 = new Duration(duration2);
    } else myDuration2 = new Duration();

    // Doing stuff
    return new Duration(
      myDuration1.raw > myDuration2.raw
        ? myDuration1.raw - myDuration2.raw
        : myDuration2.raw - myDuration1.raw,
    );
  }
  /**
   * Reads a given string and parses a duration from it.
   * @param {string} str - A string which could contain a duration
   * @param {string} doNotParse - Directly return the values read
   * @returns {Duration}
   */
  static fromString(str: string, doNotParse = false): Duration {
    const { raw, d, h, m, s, ms, ns, us } = Duration.readString(str);
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
  /**
   * Get the duration till next midnight in milliseconds.
   * @returns {number} Duration in milliseconds till the next midnight
   */
  static getCurrentDuration(): number {
    return Date.now() - new Date().setHours(0, 0, 0, 0);
  }
  /**
   * Read duration data from a string.
   * @param {string} str - The string to read
   * @returns {DurationObj} obj - Object with days, hours, mins, seconds and milliseconds
   */
  static readString(str: string): DurationObj {
    str = str.replace(/\s\s/g, "");
    const days = matchUnit(str, "d") || matchUnit(str, "days") ||
      matchUnit(str, "day");
    const hours = matchUnit(str, "h") || matchUnit(str, "hours") ||
      matchUnit(str, "hour");
    const minutes = matchUnit(str, "m") ||
      matchUnit(str, "min") ||
      matchUnit(str, "minute") ||
      matchUnit(str, "mins") ||
      matchUnit(str, "minutes");
    const seconds = matchUnit(str, "s") ||
      matchUnit(str, "sec") ||
      matchUnit(str, "second") ||
      matchUnit(str, "secs") ||
      matchUnit(str, "seconds");
    const milliseconds = matchUnit(str, "ms") ||
      matchUnit(str, "millisecond") ||
      matchUnit(str, "milliseconds");
    const nanoseconds = matchUnit(str, "ns") ||
      matchUnit(str, "nanosecond") ||
      matchUnit(str, "nanoseconds");
    const microseconds = matchUnit(str, "µs") ||
      matchUnit(str, "microsecond") ||
      matchUnit(str, "microseconds");
    matchUnit(str, "us");
    return {
      raw: days * 8.64e7 + hours * 3600000 + minutes * 60000 + seconds * 1000 +
        milliseconds +
        (microseconds / 1000) +
        (nanoseconds / 1000000),
      d: days,
      h: hours,
      m: minutes,
      s: seconds,
      ms: milliseconds,
      ns: nanoseconds,
      us: microseconds,
    };
  }
  /**
   * Get duration since a moment in time.
   * @param {Date|number} when
   * @returns {Duration} Duration
   */
  static since(when: number | Date): Duration {
    return Duration.between(
      when instanceof Date ? when.getTime() : when,
      Date.now(),
    );
  }
}

/**
 * Match a unit in a string. Like "1kg", "3L", etc.
 * @param {string} str - String to match from
 * @param {string} t - Unit to look for. Doesn't support aliases.
 * @returns {number} value - Value of the unit matched
 */
export function matchUnit(str: string, t: string): number {
  const reg = new RegExp(`(\\d+)\\s?${t}(?:[^a-z]|$)`, "i");
  const matched = reg.exec(str);
  if (!matched) return 0;
  return parseInt(matched[1].replace(t, ""));
}

/**
 * Add zeros to the beginning of a number till it reaches a certain digit count.
 * @param {number} num - Number to add zeros to.
 * @param {number} digits - Number of digits the number has to reach.
 */
export function addZero(num: number, digits = 3): string {
  const arr = new Array(digits).fill(0);
  return `${arr.join("").slice(0, 0 - num.toString().length)}${num}`;
}

// For CommonJS support
// module.exports = Duration;

export default Duration;
