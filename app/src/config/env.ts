export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
  isDev:  process.env.NODE_ENV === 'development',
};
