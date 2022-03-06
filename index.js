const keyList = {
  d: "days",
  h: "hours",
  m: "minutes",
  s: "seconds",
  ms: "milliseconds",
};

/**
 * @class
 * @param {Number} time - duration in milliseconds
 * @returns {Duration}
 */

class Duration {
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
   * @returns {Array}
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
   * @returns {Object}
   */
  get json() {
    return this.array.reduce(
      (acc, stuff) => ((acc[stuff.type] = stuff.value), acc),
      {}
    );
  }
  /**
   *
   * @param {Array} values - The values required to display
   * @param {Boolean} shortandsweet - If response should be a short string.
   * @returns {String} formatted string
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
   *
   * @param {String} from - unit to display from
   * @param {String} to - unit to display upto
   * @returns {String} formatted string
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
   *
   * @returns {String} formatted string
   */
  getSimpleFormattedDuration() {
    return `${this.array.map((x) => x.value).join(":")}`;
  }
  /**
   *
   * @returns {String} dumb string
   */
  toString() {
    return `[Duration ${this.stringify(["d", "h", "m", "s"], true)}]`;
  }
  static fromString(str) {
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
    const ts =
      days * 8.64e7 +
      hours * 3600000 +
      minutes * 60000 +
      seconds * 1000 +
      milliseconds;
    return new Duration(ts);
  }
  static getCurrentDuration() {
    return new Date().setHours(0, 0, 0, 0);
  }
}

/**
 *
 * @param {string} string - string to match from
 * @param {string} unit - unit to look for
 * @returns
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
