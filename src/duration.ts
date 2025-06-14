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
 * new Duration(); // Just 0
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
 * @property type Type of key. One of d, h, m, s, ms, us, ns
 * @property value Value of the time unit
 */
export interface KeyValue {
  type: keyof DurationObj;
  value: number;
}

/**
 * Duration Object
 */
export type DurationObj = {
  /** Number of days held by duration */
  d: number;
  /** Number of hours held by duration */
  h: number;
  /** Number of minutes held by duration */
  m: number;
  /** Number of seconds held by duration */
  s: number;
  /** Number of milliseconds held by duration */
  ms: number;
  /** Number of microseconds held by duration */
  us: number;
  /** Number of nanoseconds held by duration */
  ns: number;
};

/** Duration object with raw milliseconds */
export interface DurationObjWithRaw extends DurationObj {
  /** Total number of milliseconds in the duration */
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
  /** Number of milliseconds in a microsecond. */
  static MICROSECOND = 1 / 1_000;
  /** Number of milliseconds in a nanosecond. */
  static NANOSECOND = Duration.MICROSECOND / 1_000;
  /** One millisecond. */
  static MILLISECOND = 1;
  /** Number of milliseconds in a second. */
  static SECOND = 1_000;
  /** Number of milliseconds in a minute. */
  static MINUTE = Duration.SECOND * 60;
  /** Number of milliseconds in a hour. */
  static HOUR = Duration.MINUTE * 60;
  /** Number of milliseconds in a day. */
  static DAY = Duration.HOUR * 24;

  raw: number;
  /**
   * Parse milliseconds into separate units of time.
   * @example
   * ```ts
   * const d = new Duration(923431);
   * console.log(d)
   * ```
   * @param timestamp Milliseconds to parse into a duration object.
   */
  constructor(timestamp: number | string | Duration = 0) {
    let raw: number;
    if (typeof timestamp === "string") {
      try {
        raw = Duration.parseISOString(timestamp);
      } catch(_e) {
        raw = Duration.#readString(timestamp).raw;
      }
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
  /** Number of days in the duration */
  get d(): number {
    return Math.trunc(this.raw / 8.64e7);
  }

  set d(val: number) {
    this.setDays(val);
  }

  /** Number of hours in the duration */
  get h(): number {
    return Math.trunc(this.raw / 3_600_000) % 24;
  }

  set h(val: number) {
    this.setHours(val);
  }

  /** Number of minutes in the duration */
  get m(): number {
    return Math.trunc(this.raw / 60_000) % 60;
  }

  set m(val: number) {
    this.setMinutes(val);
  }

  /** Number of seconds in the duration */
  get s(): number {
    return Math.trunc(this.raw / 1_000) % 60;
  }

  set s(val: number) {
    this.setSeconds(val);
  }

  /** Number of milliseconds in the duration */
  get ms(): number {
    return Math.trunc(this.raw) % 1_000;
  }

  set ms(val: number) {
    this.setMilliseconds(val);
  }

  /** Number of microseconds in the duration */
  get us(): number {
    return Math.trunc(this.raw * 1_000) % 1000;
  }

  set us(val: number) {
    this.setMicroseconds(val);
  }

  /** Number of nanoseconds in the duration */
  get ns(): number {
    return Math.trunc(this.raw * 1_000_000) % 1000;
  }

  set ns(val: number) {
    this.setNanoseconds(val);
  }

  /** Alias for this.d */
  get days(): number {
    return this.d;
  }

  set days(val: number) {
    this.d = val;
  }

  /** Alias for this.h */
  get hours(): number {
    return this.h;
  }

  set hours(val: number) {
    this.h = val;
  }

  /** Alias for this.m */
  get minutes(): number {
    return this.m;
  }

  set minutes(val: number) {
    this.m = val;
  }

  /** Alias for this.s */
  get seconds(): number {
    return this.s;
  }

  set seconds(val: number) {
    this.s = val;
  }

  /** Alias for this.ms */
  get milliseconds(): number {
    return this.ms;
  }

  set milliseconds(val: number) {
    this.ms = val;
  }

  /** Alias for this.us */
  get microseconds(): number {
    return this.us;
  }

  set microseconds(val: number) {
    this.us = val;
  }

  /** Alias for this.ns */
  get nanoseconds(): number {
    return this.ns;
  }

  set nanoseconds(val: number) {
    this.ns = val;
  }

  /** Alias for this.us */
  get µs(): number {
    return this.us;
  }

  set µs(val: number) {
    this.us = val;
  }

  /**
   * Data in the class mapped as a JavaScript Object.
   * @returns A simple record with time units as keys.
   */
  get json(): DurationObj {
    return this.array.reduce(
      (acc, stuff) => ((acc[stuff.type] = stuff.value), acc),
      BaseDurationObj,
    );
  }

  /**
   * Get the absolute value of duration.
   */
  abs(): Duration {
    return new Duration(Math.abs(this.raw))
  }

  /**
   * @deprecated since v5.1.0.
   * Set the value of `d` directly instead with `duration.d += n`.
   *
   * Add more days to the duration.
   * @param n Number of days to add.
   */
  addDays(n: number): Duration {
    this.d += n;
    return this;
  }

  /**
   * @deprecated since v5.1.0.
   * Set the value of `h` directly instead with `duration.h += n`.
   *
   * Add more hours to the duration.
   * @param n Number of hours to add.
   * @returns The updated duration.
   */
  addHours(n: number): Duration {
    this.h += n;
    return this;
  }

  /**
   * @deprecated since v5.1.0.
   * Set the value of `m` directly instead with `duration.m += n`.
   *
   * Add more minutes to the duration.
   * @param n Number of minutes to add.
   * @returns The updated duration.
   */
  addMinutes(n: number): Duration {
    this.m += n;
    return this;
  }

  /**
   * @deprecated since v5.1.0.
   * Set the value of `s` directly instead with `duration.s += n`.
   *
   * Add more seconds to the duration.
   * @param n Number of seconds to add.
   * @returns The updated duration.
   */
  addSeconds(n: number): Duration {
    this.s += n;
    return this;
  }

  /**
   * @deprecated since v5.1.0.
   * Set the value of `ms` directly instead with `duration.ms += n`.
   *
   * Add more milliseconds to the duration.
   * @param n Number of milliseconds to add.
   * @returns The updated duration.
   */
  addMilliseconds(n: number): Duration {
    this.ms += n;
    return this;
  }

  /**
   * @deprecated since v5.1.0.
   * Set the value of `us` directly instead with `duration.us += n`.
   *
   * Add more microseconds to the duration.
   * @param n Number of microseconds to add.
   * @returns The updated duration.
   */
  addMicroseconds(n: number): Duration {
    this.us += n;
    return this;
  }

  /**
   * @deprecated since v5.1.0.
   * Set the value of `ns` directly instead with `duration.ns += n`.
   *
   * Add more nanoseconds to the duration.
   * @param n Number of nanoseconds to add.
   * @returns The updated duration.
   */
  addNanoseconds(n: number): Duration {
    this.ns += n;
    return this;
  }

  /**
   * Get duration as days.
   * @returns Duration as days.
   */
  asDays(): number {
    return this.raw / Duration.DAY;
  }

  /**
   * Get duration as hours.
   * @returns Duration as hours.
   */
  asHours(): number {
    return this.raw / Duration.HOUR;
  }

  /**
   * Get duration as minutes.
   * @returns Duration as minutes.
   */
  asMinutes(): number {
    return this.raw / Duration.MINUTE;
  }

  /**
   * Get duration as seconds.
   * @returns Duration as seconds.
   */
  asSeconds(): number {
    return this.raw / Duration.SECOND;
  }

  /**
   * Get duration as milliseconds.
   * @returns Duration as milliseconds.
   */
  asMilliseconds(): number {
    return this.raw;
  }

  /**
   * Get duration as microseconds.
   * @returns Duration as microseconds.
   */
  asMicroseconds(): number {
    return this.raw / Duration.MICROSECOND;
  }

  /**
   * Get duration as nanoseconds.
   * @returns Duration as nanoseconds.
   */
  asNanoseconds(): number {
    return this.raw / Duration.NANOSECOND;
  }

  /**
   * Clone current duration.
   * @returns cloned duration
   */
  clone(): Duration {
    return new Duration(this.raw);
  }

  /**
   * Compare with another duration.
   * @param that Another duration
   * @returns 0 if the durations are equal,
   * -1 if the current duration is lesser,
   * +1 if the current duration is greater
   */
  compareTo(that: Duration): number {
    if (this.raw === that.raw) return 0;
    else if (this.raw > that.raw) return 1;
    else return (-1)
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
   * Check if another duration is equal to this.
   * @param that Another duration
   * @returns Whether the two durations are equal
   */
  equals(that: Duration): boolean {
    if (this.raw === that.raw) return true;
    return false;
  }

  /**
   * Get a simple formatted duration in the form dd:hh:mm:ss:ms (Deprecated. Use Duration#toString())
   * @returns Formatted string
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
   * @param that Another duration
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
   * Get the negated value of the duration. This
   * is the opposite of `abs()`.
   * @returns Negated duration
   */
  negated(): Duration {
    return new Duration(-Math.abs(this.raw));
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
   * @deprecated
   * Does nothing. Will be removed in v6.0.0.
   */
  reload() {}

  /**
   * Set days of the duration.
   * @param n Number of days to set.
   * @returns The updated duration.
   */
  setDays(n: number): Duration {
    this.raw += (n - this.d) * Duration.DAY;
    return this;
  }

  /**
   * Set hours of the duration.
   * @param n Number of hours to set.
   * @returns The updated duration.
   */
  setHours(n: number): Duration {
    this.raw += (n - this.h) * Duration.HOUR;
    return this;
  }

  /**
   * Set minutes of the duration.
   * @param n Number of minutes to set.
   * @returns The updated duration.
   */
  setMinutes(n: number): Duration {
    this.raw += (n - this.m) * Duration.MINUTE;
    return this;
  }

  /**
   * Set seconds of the duration.
   * @param n Number of seconds to set.
   * @returns The updated duration.
   */
  setSeconds(n: number): Duration {
    this.raw += (n - this.s) * Duration.SECOND;
    return this;
  }

  /**
   * Set milliseconds of the duration.
   * @param n Number of milliseconds to set.
   * @returns The updated duration.
   */
  setMilliseconds(n: number): Duration {
    this.raw += (n - this.ms) * Duration.MILLISECOND;
    return this;
  }

  /**
   * Set microseconds of the duration.
   * @param n Number of microseconds to set.
   * @returns The updated duration.
   */
  setMicroseconds(n: number): Duration {
    this.raw += (n - this.us) * Duration.MICROSECOND;
    return this;
  }

  /**
   * Set nanoseconds of the duration.
   * @param n Number of nanoseconds to set.
   * @returns The updated duration.
   */
  setNanoseconds(n: number): Duration {
    this.raw += (n - this.ns) * Duration.NANOSECOND;
    return this;
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
          .filter((x) => (values === true ? x.value !== 0 : true))
          .map(
            (x) =>
              `${x.value} ${
                x.value === 1 ? keyList[x.type].slice(0, -1) : keyList[x.type]
              }`,
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
   * Convert the duration into an ISO 8601 duration string.
   * @returns ISO 8601 duration
   */
  toISOString(): string {
    let isoString = "P";
    if (this.d !== 0) isoString += `${this.d}D`
    isoString += "T";
    if (this.h !== 0) isoString += `${this.h}H`
    if (this.m !== 0) isoString += `${this.m}M`
    if (this.s !== 0 || this.ms !== 0) isoString += `${this.s}.${this.ms}S`
    return isoString;
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
          .filter((x) => (values === true ? x.value !== 0 : true))
          .map((x) => `${x.value}${x.type}`)
          .join(" ")
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
   * Get a simple formatted duration in the Xd Xh Xm Xs Xms
   * @returns Formatted string
   */
  toString(): string {
    return `${this.toShortString()}`;
  }

  /**
   * Get a duration formatted using colons (:).
   * Example: `00:04:20:00:000:000`
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
          .filter((x) => (values === true ? x.value !== 0 : true))
          .map(
            (x) =>
              `${InWords(x.value).trim()} ${
                x.value === 1 ? keyList[x.type].slice(0, -1) : keyList[x.type]
              }`,
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
      myDuration1.raw - myDuration2.raw,
    );
  }

  /**
   * Reads a given string and parses a duration from it.
   * @param str A string which could contain a duration
   * @param doNotParse Directly return the values read
   */
  static fromString(str: string, doNotParse: true): DurationObjWithRaw;
  static fromString(str: string, doNotParse: false): Duration;
  static fromString(
    str: string,
    doNotParse = false,
  ): Duration | DurationObjWithRaw {
    const { raw, d, h, m, s, ms, ns, us } = Duration.#readString(str);

    if (doNotParse) {
      const rawDuration: DurationObjWithRaw = { ...BaseDurationObj, raw };
      rawDuration.d = d;
      rawDuration.h = h;
      rawDuration.m = m;
      rawDuration.s = s;
      rawDuration.ms = ms;
      rawDuration.ns = ns;
      rawDuration.us = us;
      return rawDuration;
    }
    const newDuration = new Duration(raw);
    return newDuration;
  }
  /**
   * Parse ISO 8601 duration strings
   * @param isoString ISO 8601 duration
   * @returns Number of milliseconds in the duration;
   */
  static parseISOString(isoString: string): number {
    const s = isoString.toLowerCase();
    if (!s.startsWith("p") || !s.includes("t")) throw new Error(`Invalid ISO 8601 duration ${isoString}.`);
    const components = s.slice(1).split("t");
    if (components[0].includes("y") || components[0].includes("m")) throw new Error(`Year and month are not supported.`);
    return new Duration(components[1]).raw + new Duration(components[2]).raw;
  }

  /**
   * Get the time since midnight in milliseconds.
   * @returns Duration in milliseconds since 0 hours
   */
  static getCurrentDayDuration(): number {
    return Date.now() - new Date().setHours(0, 0, 0, 0);
  }

  /**
   * Read duration data from a string.
   * @param str The string to read
   * @returns obj Object with days, hours, mins, seconds and milliseconds
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
      raw: days * Duration.DAY +
        hours * Duration.HOUR +
        minutes * Duration.MINUTE +
        seconds * Duration.SECOND +
        milliseconds +
        microseconds * Duration.MICROSECOND +
        nanoseconds * Duration.NANOSECOND,
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
   * @returns Duration
   */
  static since(when: number | Date): Duration {
    return Duration.between(
      when instanceof Date ? when.getTime() : when,
      Date.now(),
    );
  }

  /**
   * Get duration since a moment in time AFTER the code started
   * running.
   * @param when Timestamp in the past
   * @returns Duration
   */
  static sinceHrTime(when: number): Duration {
    return Duration.between(when, performance.now());
  }

  /**
   * Get duration till a moment in time.
   * @param when Timestamp or Date in the future
   * @returns Duration
   */
  static till(when: number | Date): Duration {
    return Duration.between(
      Date.now(),
      when instanceof Date ? when.getTime() : when,
    );
  }

  /**
   * Get duration till a moment in time AFTER the code started
   * running.
   * @param when Timestamp in the future
   * @returns Duration
   */
  static tillHrTime(when: number): Duration {
    return Duration.between(performance.now(), when);
  }

  #customInspect(): string {
    let res = `Duration {\n`;
    for (const { type: k, value: v } of this.array) {
      res += `  ${k}: ${v},\n`;
    }
    res += `  raw: ${this.raw},\n`;
    return res + `}`;
  }
  [Symbol.for("Deno.customInspect")](): string {
    return this.#customInspect();
  }
  [Symbol.for("nodejs.util.inspect.custom")](): string {
    return this.#customInspect();
  }
}

/**
 * Match a unit in a string. Like "1kg", "3L", etc.
 * @param str String to match from
 * @param t Unit to look for. Doesn't support aliases.
 * @returns value Value of the unit matched
 */
export function matchUnit(str: string, t: string): number {
  const reg = new RegExp(`(-?\\d+(?:\\.\\d+)?)\\s?${t}(?:[^a-z]|$)`, "i");
  const matched = reg.exec(str);
  if (!matched) return 0;
  return Number(matched[1].replace(t, ""));
}

export default Duration;
