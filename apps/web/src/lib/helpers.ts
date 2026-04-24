export function formatMs(ms: number) { return ms < 1000 ? `${ms}ms` : `${(ms/1000).toFixed(2)}s`; }
export function slugify(str: string) { return str.toLowerCase().replace(/\s+/g, '-'); }
