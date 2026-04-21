const isDev = process.env.NODE_ENV === 'development';
export const logger = {
  log: (...args: unknown[]) => isDev && console.log('[LOG]', ...args),
  error: (...args: unknown[]) => console.error('[ERR]', ...args),
  warn: (...args: unknown[]) => console.warn('[WARN]', ...args),
};
