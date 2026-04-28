/**
 * useTheme — wraps next-themes for use across the app.
 *
 * Returns:
 *   theme       — 'light' | 'dark' | 'dark-blue' | 'system'
 *   resolvedTheme — the actual applied theme (never 'system')
 *   setTheme    — set theme by name
 *   dark        — boolean: true when resolved theme is 'dark' or 'dark-blue'
 *   isDarkBlue  — boolean: true when resolved theme is 'dark-blue'
 *   isLight     — boolean: true when resolved theme is 'light'
 *   isSystem    — boolean: true when theme is 'system'
 *   cycleTheme  — cycles: light → dark → dark-blue → system → light
 */
import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export type ThemeName = 'light' | 'dark' | 'dark-blue' | 'system';

const THEMES: ThemeName[] = ['light', 'dark', 'dark-blue', 'system'];

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only read theme after mount
  useEffect(() => setMounted(true), []);

  // `theme` is what user chose (may be 'system')
  const current = (mounted ? (theme ?? 'system') : 'system') as ThemeName;
  // `resolved` is the actual CSS theme being applied (never 'system')
  const resolved = (mounted ? (resolvedTheme ?? 'light') : 'light') as Exclude<ThemeName, 'system'>;

  const cycleTheme = () => {
    const idx = THEMES.indexOf(current);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTheme(next);
  };

  return {
    theme: current,           // what the user selected (may be 'system')
    resolvedTheme: resolved,  // what is actually rendered
    setTheme: (t: ThemeName) => setTheme(t),
    cycleTheme,
    dark: resolved === 'dark' || resolved === 'dark-blue',
    isDarkBlue: resolved === 'dark-blue',
    isLight: resolved === 'light',
    isSystem: current === 'system',
    mounted,
    // Legacy compat
    toggleTheme: cycleTheme,
  };
}
