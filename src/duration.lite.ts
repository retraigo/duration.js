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
export interface DurationObj {
  d: number;
  h: number;
  m: number;
  s: number;
  ms: number;
  us: number;
  ns: number;
}
