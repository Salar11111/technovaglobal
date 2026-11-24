import { useEffect, useState, useCallback } from 'react';

type Theme = 'dark' | 'light' | 'system';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const resolved: 'dark' | 'light' =
      theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
    document.documentElement.setAttribute('data-theme', resolved);
    localStorage.setItem('theme', theme);
  }, [theme, systemDark]);

  const cycleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'system';
      return 'dark';
    });
  }, []);

  const themeLabels: Record<Theme, string> = {
    dark: 'Dark',
    light: 'Light',
    system: 'System'
  };

  const themeIcons: Record<Theme, string> = {
    dark: '🌙',
    light: '☀️',
    system: '💻'
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="theme-toggle"
      aria-label={`Current theme: ${themeLabels[theme]}. Click to change.`}
      title={`Theme: ${themeLabels[theme]} (click to cycle)`}
    >
      <span aria-hidden="true">{themeIcons[theme]}</span>
      <span>{themeLabels[theme]}</span>
    </button>
  );
}
