'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

/* ─── Types ────────────────────────────────────────────────────────────────── */

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

/* ─── Context ──────────────────────────────────────────────────────────────── */

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'csit-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';

  return 'light';
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
}

/* ─── Provider ─────────────────────────────────────────────────────────────── */

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setThemeState(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const value: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  };

  /*
    Render null until mounted to prevent hydration mismatch.
    The document won't flash because applyTheme runs synchronously
    in the first useEffect before the browser paints.
  */
  if (!mounted) {
    return (
      <ThemeContext.Provider value={value}>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ─── Hook ─────────────────────────────────────────────────────────────────── */

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}