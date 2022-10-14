// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function useDuration(ms) {
    return {
        d: Math.trunc(ms / 86400000),
        h: Math.trunc(ms / 3600000) % 24,
        m: Math.trunc(ms / 60000) % 60,
        s: Math.trunc(ms / 1000) % 60,
        ms: Math.trunc(ms) % 1000,
        us: Math.trunc(ms * 1000) % 1000,
        ns: Math.trunc(ms * 1000000) % 1000
    };
}
export { useDuration as useDuration };
