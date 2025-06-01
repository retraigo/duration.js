/**
 * A library for formatting time duration.
 *
 * ## Usage
 *
 * ### Basic Usage
 *
 * ```js
 * // Node
 * import Duration from "@retraigo/duration.js";
 * // Deno
 * import Duration from "jsr:@retraigo/duration@4";
 *
 * const Duration = await import("@retraigo/duration.js"); // Node with CommonJS
 *
 * new Duration(); // Get duration since midnight
 *
 * new Duration(3545346); // A random duration
 *
 * new Duration(0); // Just 0
 *
 * new Duration(-1); // Negative duration returns a negative time
 * ```
 *
 * ### Duration since a timestamp
 * ```ts
 * const start = performance.now()
 * // Do some long task
 * const d = Duration.since(start)
 * ```
 *
 * ### Duration between two timestamps
 * ```ts
 * const start = performance.now()
 * // Do some long task
 * const check = performance.now()
 * const d = Duration.between(start, check)
 * ```
 *
 * ### From Text
 *
 * ```js
 * Duration.fromString("1m2s"); // Duration {d:0, h:0, m:1, s:2, ms:0}
 *
 * Duration.fromString("4090 sec 4939  days 7342  hour 2324milliseconds 4344 min"); // // Duration {d: 5246, h: 13, m: 52, s: 12, ms: 324 }
 * ```
 *
 * You can also get the entire Duration in milliseconds through the `raw` property.
 *
 * ```js
 * const dur = Duration.fromString(
 *   "4090 sec 4939  days 7342  hour 2324milliseconds 4344 min"
 * );
 * dur.raw; // 453304332324
 * ```
 *
 * ### Properties
 *
 * ```js
 * Duration {
 *     raw: 0 // Original milliseconds passed to the constructor
 *     d: 0, // Days
 *     h: 0, // Hours
 *     m: 0, // Minutes
 *     s: 0, // Seconds
 *     ms: 0 // Milliseconds
 *     us: 0 // Microseconds
 *     ns: 0 // Nanoseconds
 * };
 * ```
 *
 * ### Formatting
 *
 * ```ts
 * const duration = new Duration(59834344.334)
 *
 * console.log(duration)
 * // Duration { raw: 59834344.334, d: 0, h: 16, m: 37, s: 14, ms: 344, us: 334, ns: 0 }
 * console.log(duration.toDescriptiveString())
 * // 0 days, 16 hours, 37 minutes, 14 seconds, 344 milliseconds, 334 microseconds, 0 nanoseconds
 * console.log(duration.toShortString())
 * // 0d 16h 37m 14s 344ms 334us 0ns
 * console.log(duration.toWordString())
 * // zero days, sixteen hours, thirty seven minutes, fourteen seconds,
 * // three hundred and forty four milliseconds, three hundred and thirty
 * // four microseconds, zero nanoseconds
 * console.log(duration.toTimeString())
 * // 00:16:37:14:344:334:000
 * ```
 * @module
 */
import InWords from "./in_words.ts";

const keyList: Record<keyof DurationObj, string> = {
  d: "days",
  h: "hours",
  m: "minutes",
  s: "seconds",
  ms: "milliseconds",
  us: "microseconds",
  ns: "nanoseconds",
};

/**
 * For the array of values
 * @typedef {object} KeyValue
 * @property {string} type Type of key. One of d, h, m, s, ms, us, ns
 * @property {number} value Value of the time unit
 */
export interface KeyValue {
  type: keyof DurationObj;
  value: number;
}

/**
 * Duration Object
 * @typedef {Object} DurationObj
 * @property {number} raw Total number of milliseconds in the duration
 * @property {number} d Number of days held by duration
 * @property {number} h Number of hours held by duration
 * @property {number} m Number of minutes held by duration
 * @property {number} s Number of seconds held by duration
 * @property {number} ms Number of milliseconds held by duration
 * @property {number} us Number of microseconds held by duration
 * @property {number} ns Number of nanoseconds held by duration
 */
export type DurationObj = {
  d: number;
  h: number;
  m: number;
  s: number;
  ms: number;
  us: number;
  ns: number;
};

export interface DurationObjWithRaw extends DurationObj {
  raw: number;
}

const BaseDurationObj: DurationObj = {
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
 */

export class Duration implements DurationObjWithRaw {
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
   * @example
   * ```ts
   * const d = new Duration(923431);
   * console.log(d)
   * ```
   * @param {number} timestamp Milliseconds to parse into a duration object.
   * @returns {Duration}
   */
  constructor(timestamp: number | string | Duration = 0) {
    let raw: number;
    if (typeof timestamp === "string") {
      raw = Duration.#readString(timestamp).raw;
    } else if (timestamp instanceof Duration) {
      raw = timestamp.raw;
    } else if (typeof timestamp === "number") {
      raw = timestamp;
    } else {
      throw new TypeError(
        `Unsupported parameter of type ${typeof timestamp} for Duration.`,
      );
    }
    this.raw = raw;
    this.d = Math.trunc(raw / 8.64e7);
    this.h = Math.trunc(raw / 3_600_000) % 24;
    this.m = Math.trunc(raw / 60_000) % 60;
    this.s = Math.trunc(raw / 1_000) % 60;
    this.ms = Math.trunc(raw) % 1_000;
    this.us = Math.trunc(raw * 1_000) % 1000;
    this.ns = Math.trunc(raw * 1_000_000) % 1000;
  }
  /**
   * An array of time units and their values.
   * @example
   * ```ts
   * const d = new Duration(923431);
   * console.log(d.array)
   * ```
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
  /** Alias for this.d */
  get days(): number {
    return this.d;
  }
  /** Alias for this.h */
  get hours(): number {
    return this.h;
  }
  /** Alias for this.m */
  get minutes(): number {
    return this.m;
  }
  /** Alias for this.s */
  get seconds(): number {
    return this.s;
  }
  /** Alias for this.ms */
  get milliseconds(): number {
    return this.ms;
  }
  /** Alias for this.us */
  get microseconds(): number {
    return this.us;
  }
  /** Alias for this.ns */
  get nanoseconds(): number {
    return this.ns;
  }
  /** Alias for this.us */
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
   * @param {number} n Number of days to add.
   * @returns {Duration} The updated duration.
   */
  addDays(n: number): Duration {
    this.d += n;
    return this.reload();
  }
  /**
   * Add more hours to the duration.
   * @param {number} n Number of hours to add.
   * @returns {Duration} The updated duration.
   */
  addHours(n: number): Duration {
    this.h += n;
    return this.reload();
  }
  /**
   * Add more minutes to the duration.
   * @param {number} n Number of minutes to add.
   * @returns {Duration} The updated duration.
   */
  addMinutes(n: number): Duration {
    this.m += n;
    return this.reload();
  }
  /**
   * Add more seconds to the duration.
   * @param {number} n Number of seconds to add.
   * @returns {Duration} The updated duration.
   */
  addSeconds(n: number): Duration {
    this.s += n;
    return this.reload();
  }
  /**
   * Add more milliseconds to the duration.
   * @param {number} n Number of milliseconds to add.
   * @returns {Duration} The updated duration.
   */
  addMilliseconds(n: number): Duration {
    this.ms += n;
    return this.reload();
  }
  /**
   * Add more microseconds to the duration.
   * @param {number} n Number of microseconds to add.
   * @returns {Duration} The updated duration.
   */
  addMicroseconds(n: number): Duration {
    this.us += n;
    return this.reload();
  }
  /**
   * Add more nanoseconds to the duration.
   * @param {number} n Number of nanoseconds to add.
   * @returns {Duration} The updated duration.
   */
  addNanoseconds(n: number): Duration {
    this.ns += n;
    return this.reload();
  }
  /**
   * Get duration as days.
   * @returns {number} Duration as days.
   */
  asDays(): number {
    return this.raw / (24 * 60 * 60 * 1_000);
  }
  /**
   * Get duration as hours.
   * @returns {number} Duration as hours.
   */
  asHours(): number {
    return this.raw / (60 * 60 * 1_000);
  }
  /**
   * Get duration as minutes.
   * @returns {number} Duration as minutes.
   */
  asMinutes(): number {
    return this.raw / (60 * 1_000);
  }
  /**
   * Get duration as seconds.
   * @returns {number} Duration as seconds.
   */
  asSeconds(): number {
    return this.raw / 1_000;
  }
  /**
   * Get duration as milliseconds.
   * @returns {number} Duration as milliseconds.
   */
  asMilliseconds(): number {
    return this.raw;
  }
  /**
   * Get duration as microseconds.
   * @returns {number} Duration as microseconds.
   */
  asMicroseconds(): number {
    return this.raw * 1_000;
  }
  /**
   * Get duration as nanoseconds.
   * @returns {number} Duration as nanoseconds.
   */
  asNanoseconds(): number {
    return this.raw * 1_000_000;
  }
  /**
   * Clone current duration (run Duration#reload before this if you manually tweaked the properties).
   * @returns {Duration} cloned duration
   */
  clone(): Duration {
    return new Duration(this.raw);
  }
  /**
   * Divide the duration by a scalar.
   * @param scalar Another duration
   * @returns Duration divided by a scalar
   */
  dividedBy(scalar: number): Duration {
    return new Duration(this.raw / scalar);
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
        ? String(x.value).padStart(3, "0")
        : String(x.value).padStart(2, "0")
    );
  }
  /**
   * Subtract a duration from this duration and return a
   * new duration with the result.
   * @param {string|number|Duration} that Another duration
   * @returns
   */
  minus(that: Duration | number | string): Duration {
    return Duration.between(this, that);
  }
  /**
   * Multiply the duration by a scalar.
   * @param scalar Another duration
   * @returns Duration multiplied by a scalar
   */
  multipliedBy(scalar: number): Duration {
    return new Duration(this.raw * scalar);
  }
  /**
   * Add a duration to this duration and return a
   * new duration with the result.
   * @param that Another duration
   * @returns
   */
  plus(that: Duration | number | string): Duration {
    const thatDuration = new Duration(that);
    return new Duration(this.raw + thatDuration.raw);
  }
  /**
   * Update data to match any modification to values.
   * @example
   * ```ts
   * const d = new Duration(923431);
   * d.ms += 5;
   * d.s += 7;
   * console.log(d); // before update
   * d.reload();
   * console.log(d); // after update
   * ```
   * @returns Updated duration.
   */
  reload(): Duration {
    const ts = this.d * 8.64e7 +
      this.h * 3600000 +
      this.m * 60000 +
      this.s * 1000 +
      this.ms +
      this.us / 1000 +
      this.ns / 1000000;
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
   * @param n Number of days to set.
   * @returns The updated duration.
   */
  setDays(n: number): Duration {
    this.d = n;
    return this.reload();
  }
  /**
   * Set hours of the duration.
   * @param n Number of hours to set.
   * @returns The updated duration.
   */
  setHours(n: number): Duration {
    this.h = n;
    return this.reload();
  }
  /**
   * Set minutes of the duration.
   * @param n Number of minutes to set.
   * @returns The updated duration.
   */
  setMinutes(n: number): Duration {
    this.m = n;
    return this.reload();
  }
  /**
   * Set seconds of the duration.
   * @param n Number of seconds to set.
   * @returns The updated duration.
   */
  setSeconds(n: number): Duration {
    this.s = n;
    return this.reload();
  }
  /**
   * Set milliseconds of the duration.
   * @param n Number of milliseconds to set.
   * @returns The updated duration.
   */
  setMilliseconds(n: number): Duration {
    this.ms = n;
    return this.reload();
  }
  /**
   * Set microseconds of the duration.
   * @param n Number of microseconds to set.
   * @returns The updated duration.
   */
  setMicroseconds(n: number): Duration {
    this.us = n;
    return this.reload();
  }
  /**
   * Set nanoseconds of the duration.
   * @param n Number of nanoseconds to set.
   * @returns The updated duration.
   */
  setNanoseconds(n: number): Duration {
    this.ns = n;
    return this.reload();
  }
  /**
   * Get a formatted, human-readable string of the duration.
   * @param values The values required to display.
   * @returns formatted string The formatted string result.
   */
  toDescriptiveString(skipZeroDurations?: true): string;
  toDescriptiveString(values: string[] | null | true = []): string {
    if (!Array.isArray(values) || values.length == 0) {
      return `${
        this.array
          .filter((x) => (values === true) ? x.value !== 0 : true)
          .map((x) =>
            `${x.value} ${
              x.value === 1 ? keyList[x.type].slice(0, -1) : keyList[x.type]
            }`
          )
          .join(", ")
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
   * @returns Duration object
   */
  toJSON(): DurationObj {
    return this.json;
  }

  /**
   * Get a formatted, human-readable string of the duration.
   * @param values The values required to display.
   * @returns formatted string The formatted string result.
   */
  toShortString(skipZeroDurations?: true): string;
  toShortString(values: string[] | null | true = []): string {
    if (!Array.isArray(values) || values.length == 0) {
      return `${
        this.array
          .filter((x) => (values === true) ? x.value !== 0 : true)
          .map((x) => `${x.value}${x.type}`).join(" ")
      }`;
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
   * @returns Formatted string
   */
  toString(): string {
    return `${this.getFormattedDurationArray().join(":")}`;
  }
  /**
   * Get a duration formatted using colons (:).
   * @param fromT Unit to display from.
   * @param toT Unit to display upto.
   * @returns Formatted string.
   */
  toTimeString(
    fromT: keyof DurationObj = "d",
    toT: keyof DurationObj = "ns",
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
    return durations
      .slice(listOfKeys.indexOf(fromT), listOfKeys.indexOf(toT) + 1)
      .join(":");
  }
  /**
   * Get a human-readable string of the duration in words.
   * @param values The values required to display.
   * @returns formatted string The formatted string result.
   */
  toWordString(skipZeroDurations?: true): string;
  toWordString(values: string[] | null | true = []): string {
    if (!Array.isArray(values) || values.length === 0) {
      return `${
        this.array
          .filter((x) => (values === true) ? x.value !== 0 : true)
          .map((x) =>
            `${InWords(x.value).trim()} ${
              x.value === 1 ? keyList[x.type].slice(0, -1) : keyList[x.type]
            }`
          )
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
   * @returns Raw milliseconds of the duration
   */
  valueOf(): number {
    return this.raw;
  }
  /**
   * Get the duration between two timestamps or two other durations.
   * @param duration1 Duration/Timestamp to find duration from.
   * @param duration2 Duration/Timestamp to find duration upto.
   * @returns New duration between the two specified durations.
   */
  static between(
    duration1: string | number | Duration | Date,
    duration2: string | number | Duration | Date | undefined | null,
  ): Duration {
    let myDuration1: Duration, myDuration2: Duration;
    // Duration 1
    if (duration1 instanceof Duration) myDuration1 = duration1;
    else if (typeof duration1 === "string") {
      myDuration1 = new Duration(duration1);
    } else if (typeof duration1 === "number") {
      myDuration1 = new Duration(duration1);
    } else if (duration1 instanceof Date) {
      myDuration1 = new Duration(duration1.getTime());
    } else myDuration1 = new Duration();
    // Duration 2
    if (duration2 instanceof Duration) myDuration2 = duration2;
    else if (typeof duration2 === "string") {
      myDuration2 = new Duration(duration2);
    } else if (typeof duration2 === "number") {
      myDuration2 = new Duration(duration2);
    } else if (duration2 instanceof Date) {
      myDuration2 = new Duration(duration2.getTime());
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
   * @param str A string which could contain a duration
   * @param doNotParse Directly return the values read
   */
  static fromString(str: string, doNotParse = false): Duration {
    const { raw, d, h, m, s, ms, ns, us } = Duration.#readString(str);
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
   * Get the duration since midnight in milliseconds.
   * @returns Duration in milliseconds since 0 hours
   */
  static getCurrentDayDuration(): number {
    return Date.now() - new Date().setHours(0, 0, 0, 0);
  }
  /**
   * Read duration data from a string.
   * @param {string} str The string to read
   * @returns {DurationObj} obj Object with days, hours, mins, seconds and milliseconds
   */
  static #readString(str: string): DurationObjWithRaw {
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
      matchUnit(str, "microseconds") ||
      matchUnit(str, "us");
    return {
      raw: days * 8.64e7 +
        hours * 3_600_000 +
        minutes * 60_000 +
        seconds * 1_000 +
        milliseconds +
        microseconds / 1_000 +
        nanoseconds / 1_000_000,
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
   * @param when Timestamp or Date in the past
   * @returns {Duration} Duration
   */
  static since(when: number | Date): Duration {
    return Duration.between(
      when instanceof Date ? when.getTime() : when,
      Date.now(),
    );
  }

  /**
   * Get duration till a moment in time.
   * @param when Timestamp or Date in the future
   * @returns {Duration} Duration
   */
  static till(when: number | Date): Duration {
    return Duration.between(
      Date.now(),
      when instanceof Date ? when.getTime() : when,
    );
  }
}

/**
 * Match a unit in a string. Like "1kg", "3L", etc.
 * @param {string} str String to match from
 * @param {string} t Unit to look for. Doesn't support aliases.
 * @returns {number} value Value of the unit matched
 */
export function matchUnit(str: string, t: string): number {
  const reg = new RegExp(`(\\d+)\\s?${t}(?:[^a-z]|$)`, "i");
  const matched = reg.exec(str);
  if (!matched) return 0;
  return parseInt(matched[1].replace(t, ""));
}

// For CommonJS support
// module.exports = Duration;

export default Duration;
