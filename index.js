/**
 * A simple JavaScript class used to parse time durations
 * @module Duration
 */

const keyList = {
  d: "days",
  h: "hours",
  m: "minutes",
  s: "seconds",
  ms: "milliseconds",
};

/**
 * For the array of values
 * @typedef {object} KeyValue
 * @property {string} type - Type of key. One of d, h, m, s, ms
 * @property {number} value - Value of the time unit
 */

/**
 * Duration Object
 * @typedef {Object} DurationObj
 * @property {Number} raw - Total number of milliseconds in the duration
 * @property {Number} d - Number of days held by duration
 * @property {Number} h - Number of hours held by duration
 * @property {Number} m - Number of minutes held by duration
 * @property {Number} s - Number of seconds held by duration
 * @property {Number} ms - Number of milliseconds held by duration
 */

/**
 * A duration class which parses milliseconds into human readable form.
 * @class
 */

class Duration {
  /**
   * Create a new Duration
   * @param {number} timestamp - Duration in milliseconds
   * @returns {<Duration>}
   */
  constructor(timestamp = Duration.getCurrentDuration()) {
    if (timestamp < 1) timestamp = 0; // Prevent negative time
    this.raw = timestamp;
    this.d = Math.trunc(timestamp / 86400000);
    this.h = Math.trunc(timestamp / 3600000) % 24;
    this.m = Math.trunc(timestamp / 60000) % 60;
    this.s = Math.trunc(timestamp / 1000) % 60;
    this.ms = Math.trunc(timestamp) % 1000;
  }
  /**
   * Data in the class mapped into an Array with properties "type" and "value"
   * @returns {KeyValue[]}
   */
  get array() {
    return [
      { type: "d", value: this.d },
      { type: "h", value: this.h },
      { type: "m", value: this.m },
      { type: "s", value: this.s },
      { type: "ms", value: this.ms },
    ];
  }
  /**
   * Data in the class mapped as a JavaScript Object.
   * @returns {DurationObj}
   */
  get json() {
    return this.array.reduce(
      (acc, stuff) => ((acc[stuff.type] = stuff.value), acc),
      {}
    );
  }
  /**
   *
   * @param {string[]} values - The values required to display
   * @param {boolean} shortandsweet - If response should be a short string.
   * @returns {string} formatted string - The formatted string result
   */
  stringify(values = [], shortandsweet = false) {
    if (!Array.isArray(values) || values.length == 0) {
      if (
        !shortandsweet ||
        typeof shortandsweet !== "boolean" ||
        shortandsweet == false
      )
        return `${this.array
          .map((x) => `${x.value} ${keyList[x.type]}`)
          .join(", ")}`;
      return `${this.array.map((x) => `${x.value}${x.type}`).join(" ")}`;
    }
    if (values.length > 0) {
      if (
        !shortandsweet ||
        typeof shortandsweet !== "boolean" ||
        shortandsweet == false
      )
        return `${this.array
          .filter((x) => values.includes(x.type))
          .map((x) => `${x.value} ${keyList[x.type]}`)
          .join(", ")}`;
      return `${this.array
        .filter((x) => values.includes(x.type))
        .map((x) => `${x.value}${x.type}`)
        .join(" ")}`;
    }
    return `${this.array
      .map((x) => `${x.value} ${keyList[x.type]}`)
      .join(", ")}`;
  }
  /**
   * Get a duration formatted using colons (:)
   * @param {string} fromT - Unit to display from
   * @param {string} toT - Unit to display upto
   * @returns {string} Formatted string
   */
  getFormattedDuration(fromT = "d", toT = "ms") {
    if (
      typeof fromT !== "string" ||
      typeof toT !== "string" ||
      !keyList.hasOwnProperty(fromT.toLowerCase()) ||
      !keyList.hasOwnProperty(toT.toLowerCase())
    )
      return this.getSimpleFormattedDuration();
    const durations = [];
    const next =
      this.array[this.array.findIndex((x) => x.type === toT.toLowerCase()) + 1];
    for (const obj of this.array) {
      if (obj.type !== fromT.toLowerCase() && durations.length === 0) continue;
      if (obj.type === next.type) break;
      durations.push(obj.value);
    }
    return durations.join(":");
  }
  /**
   * Get a simple formatted duration in the form dd:hh:mm:ss:ms
   * @returns {string} Formatted string
   */
  getSimpleFormattedDuration() {
    return `${this.array.map((x) => x.value).join(":")}`;
  }
  /**
   * Extra filler function that returns the class data in a single short string.
   * @returns {string} Dumb string
   */
  toString() {
    return `[Duration ${this.stringify(["d", "h", "m", "s"], true)}]`;
  }
  /**
   * Updated data to match any modification to values.
   * @returns {<Duration>}
   */
  reload() {
    const ts =
      this.days * 8.64e7 +
      this.hours * 3600000 +
      this.minutes * 60000 +
      this.seconds * 1000 +
      this.milliseconds;
    if (ts === this.raw) return this;
    const newDuration = new Duration(ts);
    this.days = newDuration.days;
    this.hours = newDuration.hours;
    this.minutes = newDuration.minutes;
    this.seconds = newDuration.seconds;
    this.milliseconds = newDuration.milliseconds;
    this.raw = newDuration.raw;
    return this;
  }
  /**
   * Reads a given string and parses a duration from it.
   * @param {string} str - A string which could contain a duration
   * @param {string} doNotParse - Directly return the values read
   * @returns {<Duration>}
   */
  static fromString(str, doNotParse = false) {
    const { d, h, m, s, ms } = Duration.readString(str);
    const ts = d * 8.64e7 + h * 3600000 + m * 60000 + s * 1000 + ms;

    const newDuration = new Duration(ts);
    if (doNotParse) {
      newDuration.days = days;
      newDuration.hours = hours;
      newDuration.minutes = minutes;
      newDuration.seconds = seconds;
      newDuration.milliseconds = milliseconds;
    }
    return newDuration;
  }
  /**
   * Get the duration till next midnight in milliseconds.
   * @returns {number} Duration in milliseconds till the next midnight
   */
  static getCurrentDuration() {
    return new Date().setHours(0, 0, 0, 0);
  }
  /**
   * Read duration data from a string.
   * @param {string} str - The string to read
   * @returns {DurationObj} obj - Object with days, hours, mins, seconds and milliseconds
   */
  static readString(str) {
    str = str.replace(/\s\s/g, "");
    const days =
      matchReg(str, "d") || matchReg(str, "days") || matchReg(str, "day");
    const hours =
      matchReg(str, "h") || matchReg(str, "hours") || matchReg(str, "hour");
    const minutes =
      matchReg(str, "m") ||
      matchReg(str, "min") ||
      matchReg(str, "minute") ||
      matchReg(str, "mins") ||
      matchReg(str, "minutes");
    const seconds =
      matchReg(str, "s") ||
      matchReg(str, "sec") ||
      matchReg(str, "second") ||
      matchReg(str, "secs") ||
      matchReg(str, "seconds");
    const milliseconds =
      matchReg(str, "ms") ||
      matchReg(str, "millisecond") ||
      matchReg(str, "milliseconds");
    return { d: days, h: hours, m: minutes, s: seconds, ms: milliseconds };
  }
}

/**
 * Match a unit in a string. Like "1kg", "3L", etc.
 * @param {string} str - String to match from
 * @param {string} t - Unit to look for. Doesn't support aliases.
 * @returns {number} value - Value of the unit matched
 */
function matchReg(str, t) {
  const reg = new RegExp(`(\\d+)\\s?${t}(?:[^a-z]|$)`, "i");
  const matched = reg.exec(str);
  if (!matched) return 0;
  return parseInt(matched[1].replace(t, ""));
}

// module.exports = Duration;

export default Duration;
export { Duration, matchReg as MatchUnit };
