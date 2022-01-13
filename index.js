const keyList = {
  d: "days",
  h: "hours",
  m: "minutes",
  s: "seconds",
  ms: "milliseconds",
};

/**
 * Duration class. Yes, Duration. Ain't gonna give it a better name with my crappy naming sense.
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
  get array() {
    return [
      { type: "d", value: this.d },
      { type: "h", value: this.h },
      { type: "m", value: this.m },
      { type: "s", value: this.s },
      { type: "ms", value: this.ms },
    ];
  }
  get json() {
    return this.array.reduce((acc, stuff) => (acc[stuff.type] = stuff.value, acc), {})
  }
  /**
   *
   * @param {Array} values - The values required
   * @param {Boolean} shortandsweet - If response should be a short string.
   * @returns {String}
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
  toString() {
    return `[Duration ${this.stringify(['d', 'h', 'm', 's'], true)}]`
  }
  static getCurrentDuration() {
    return new Date().setHours(0, 0, 0, 0);
  }
}

module.exports = Duration;
