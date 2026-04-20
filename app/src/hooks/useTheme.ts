import { useState, useEffect } from 'react';

export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Read from localStorage on mount
    const saved = localStorage.getItem('theme-dark') === 'true';
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDark(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Listener for syncing state between tabs or other components
    const onThemeChange = () => {
      const isDark = localStorage.getItem('theme-dark') === 'true';
      setDark(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    window.addEventListener('theme-change', onThemeChange);
    window.addEventListener('storage', onThemeChange);

    return () => {
      window.removeEventListener('theme-change', onThemeChange);
      window.removeEventListener('storage', onThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    localStorage.setItem('theme-dark', String(newDark));
    window.dispatchEvent(new Event('theme-change')); // Tell other instances to update
  };

  return { dark, toggleTheme };
}
