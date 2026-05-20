'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

/* ─── Icons ────────────────────────────────────────────────────────────────── */

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/* ─── Styles ───────────────────────────────────────────────────────────────── */

const buttonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border-default)',
  background: 'var(--bg-surface)',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: [
    'background-color var(--transition-fast)',
    'color var(--transition-fast)',
    'border-color var(--transition-fast)',
  ].join(', '),
  flexShrink: 0,
};

/* ─── Component ────────────────────────────────────────────────────────────── */

interface ThemeToggleProps {
  /** Extra inline style overrides if needed at the usage site */
  style?: React.CSSProperties;
  className?: string;
}

export default function ThemeToggle({ style, className }: ThemeToggleProps) {
  const { isDark, toggleTheme, theme } = useTheme();

  function handleClick() {
    toggleTheme();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  }

  const merged: React.CSSProperties = { ...buttonStyle, ...style };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={merged}
      className={className}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--bg-hover)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--bg-surface)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-default)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}