import { useEffect, useState, useCallback } from 'react';

type Theme = 'dark' | 'light' | 'system';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  // Resolve system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Theme is applied in the next effect
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    let resolved: 'dark' | 'light';
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = theme;
    }
    document.documentElement.setAttribute('data-theme', resolved);
    localStorage.setItem('theme', theme);
  }, [theme]);

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
      style={{
        background: 'transparent',
        border: '1px solid var(--color-glass-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.5rem 0.75rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--color-text-main)',
        fontSize: '0.875rem',
        transition: 'all var(--transition-fast)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-glass-border)';
      }}
    >
      <span aria-hidden="true">{themeIcons[theme]}</span>
      <span>{themeLabels[theme]}</span>
    </button>
  );
}