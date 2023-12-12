export type KeyList = {
  d: string;
  h: string;
  m: string;
  s: string;
  ms: string;
  us: string;
  ns: string;
}
export type DurationKeys = "d" | "h" | "m" | "s" | "ms" | "us" | "ns";

export type KeyValue = {
  type: DurationKeys;
  value: number;
}
export type DurationObj = {
    raw: number;
    d: number;
    h: number;
    m: number;
    s: number;
    ms: number;
    us: number;
    ns: number;
  }
  