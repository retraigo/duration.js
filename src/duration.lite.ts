/**
 * A lighter alternative to duration.js.
 * ```ts
 * import { Duration } from "jsr:@retraigo/duration@4/lite"
 *
 * Duration(700908)
 * // { d: 0, h: 0, m: 11, s: 40, ms: 908, us: 0, ns: 0 }
 * ```
 * @module
 */

/**
 * A lighter alternative to duration.js
 * @param ms Time in milleseconds to parse into a duration.
 */
export function Duration(ms: number): DurationObj {
  return {
    d: Math.trunc(ms / 86400000),
    h: Math.trunc(ms / 3600000) % 24,
    m: Math.trunc(ms / 60000) % 60,
    s: Math.trunc(ms / 1000) % 60,
    ms: Math.trunc(ms) % 1000,
    us: Math.trunc(ms * 1000) % 1000,
    ns: Math.trunc(ms * 1000000) % 1000,
  };
}
/** Object with duration components as fields */
export type DurationObj = {
  d: number;
  h: number;
  m: number;
  s: number;
  ms: number;
  us: number;
  ns: number;
};
