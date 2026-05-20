'use client';

import React from 'react';
import ThemeToggle from '@/components/ui/ThemeToggle';

/* ─── Types ────────────────────────────────────────────────────────────────── */

export type SubjectId = 'daa' | 'sad' | 'crypto' | 'sim' | 'web' | 'mm';

export interface Subject {
  id: SubjectId;
  label: string;
  accent: string;
}

export const SUBJECTS: Subject[] = [
  { id: 'daa',    label: 'DAA',    accent: 'var(--accent-daa)'    },
  { id: 'sad',    label: 'SAD',    accent: 'var(--accent-sad)'    },
  { id: 'crypto', label: 'Crypto', accent: 'var(--accent-crypto)' },
  { id: 'sim',    label: 'Sim',    accent: 'var(--accent-sim)'    },
  { id: 'web',    label: 'Web',    accent: 'var(--accent-web)'    },
  { id: 'mm',     label: 'MM',     accent: 'var(--accent-mm)'     },
];

interface NavbarProps {
  activeSubject: SubjectId;
  onSubjectChange: (id: SubjectId) => void;
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

/* ─── Component ─────────────────────────────────────────────────────────────── */

export default function Navbar({
  activeSubject,
  onSubjectChange,
  onMenuToggle,
  sidebarOpen,
}: NavbarProps) {
  return (
    <header
      role="banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--navbar-height)',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        paddingInline: 'var(--space-4)',
        gap: 'var(--space-3)',
        zIndex: 100,
      }}
    >
      {/* ── Hamburger (mobile only — hidden ≥ 400px) ── */}
      <button
        type="button"
        aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={sidebarOpen}
        aria-controls="sidebar"
        onClick={onMenuToggle}
        style={{
          display: 'none', /* overridden by media query class below */
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)',
          background: 'transparent',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'background-color var(--transition-fast)',
        }}
        className="navbar-hamburger"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--bg-hover)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
        }}
      >
        {sidebarOpen ? <IconX /> : <IconMenu />}
      </button>

      {/* ── Wordmark ── */}
      <div
        style={{
          fontWeight: 600,
          fontSize: 'var(--text-base)',
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
          flexShrink: 0,
          userSelect: 'none',
        }}
        aria-label="CSIT Board Prep"
      >
        CSIT<span style={{ color: 'var(--color-primary)', fontWeight: 500 }}> Prep</span>
      </div>

      {/* ── Subject buttons (desktop only — hidden < 400px) ── */}
      <nav
        aria-label="Subject navigation"
        className="navbar-subjects"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {SUBJECTS.map((s) => {
          const isActive = s.id === activeSubject;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={isActive}
              aria-label={`Switch to ${s.label}`}
              onClick={() => onSubjectChange(s.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                height: 32,
                paddingInline: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: isActive
                  ? `1px solid ${s.accent}`
                  : '1px solid transparent',
                background: isActive ? 'var(--bg-selected)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 500 : 400,
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                flexShrink: 0,
                transition: [
                  'background-color var(--transition-fast)',
                  'color var(--transition-fast)',
                  'border-color var(--transition-fast)',
                ].join(', '),
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'var(--bg-hover)';
                  (e.currentTarget as HTMLButtonElement).style.color =
                    'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color =
                    'var(--text-secondary)';
                }
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: s.accent,
                  flexShrink: 0,
                  opacity: isActive ? 1 : 0.5,
                }}
              />
              {s.label}
            </button>
          );
        })}
      </nav>

      {/* ── Right slot: theme toggle ── */}
      <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
        <ThemeToggle />
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 399px) {
          .navbar-hamburger { display: inline-flex !important; }
          .navbar-subjects  { display: none !important; }
        }
      `}</style>
    </header>
  );
}

/* ─── Icons ─────────────────────────────────────────────────────────────────── */

function IconMenu() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  );
}