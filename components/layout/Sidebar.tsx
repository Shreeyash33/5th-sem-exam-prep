'use client';

import React, { useEffect, useRef } from 'react';
import Dropdown from '@/components/ui/Dropdown';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { SUBJECTS, type SubjectId } from '@/components/layout/Navbar';

/* ─── Section definitions ───────────────────────────────────────────────────── */

export type SectionId =
  | 'analysis'
  | 'important'
  | 'reading'
  | 'wildcards'
  | 'past-papers'
  | 'mock';

export interface Section {
  id: SectionId;
  label: string;
}

export const SECTION_GROUPS = [
  {
    options: [
      { value: 'analysis'   as SectionId, label: 'Topic Analysis'       },
      { value: 'important'  as SectionId, label: 'Important Topics'      },
      { value: 'reading'    as SectionId, label: 'Priority Reading List' },
      { value: 'wildcards'  as SectionId, label: 'Wildcard Topics'       },
    ],
  },
  {
    options: [
      { value: 'past-papers' as SectionId, label: 'Solved Past Papers' },
      { value: 'mock'        as SectionId, label: 'Mock Papers'         },
    ],
  },
];

/* ─── Types ────────────────────────────────────────────────────────────────── */

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  activeSubject: SubjectId;
  onSubjectChange: (id: SubjectId) => void;
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
}

/* ─── Component ─────────────────────────────────────────────────────────────── */

export default function Sidebar({
  open,
  onClose,
  activeSubject,
  onSubjectChange,
  activeSection,
  onSectionChange,
}: SidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);

  /* Trap focus and close on Escape when open (mobile) */
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  /* Prevent body scroll while mobile sidebar is open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const activeSubjectData = SUBJECTS.find((s) => s.id === activeSubject)!;

  /* Subject items for the mobile dropdown */
  const subjectItems = [
    {
      options: SUBJECTS.map((s) => ({
        value: s.id,
        label: s.label,
        accent: s.accent,
      })),
    },
  ];

  return (
    <>
      {/* ── Backdrop (mobile only) ── */}
      {open && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="sidebar-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 149,
            background: 'var(--bg-overlay)',
            animation: 'fade-in 160ms ease',
          }}
        />
      )}

      {/* ── Sidebar panel ── */}
      <aside
        id="sidebar"
        ref={sidebarRef}
        role="complementary"
        aria-label="Section navigation"
        /* aria-hidden hides from AT when off-screen on mobile */
        aria-hidden={!open ? true : undefined}
        className="sidebar-panel"
        style={{
          position: 'fixed',
          top: 'var(--navbar-height)',
          left: 0,
          bottom: 0,
          width: 'var(--sidebar-width)',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          zIndex: 150,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* ── Active subject indicator ── */}
        <div
          style={{
            padding: 'var(--space-4) var(--space-4) var(--space-3)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <p
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 'var(--space-2)',
            }}
          >
            Current subject
          </p>

          {/* Mobile: subject dropdown (hidden on desktop) */}
          <div className="sidebar-subject-dropdown">
            <Dropdown
              items={subjectItems}
              value={activeSubject}
              onChange={(val) => onSubjectChange(val as SubjectId)}
              fullWidth
              size="sm"
            />
          </div>

          {/* Desktop: just a label pill (hidden on mobile) */}
          <div
            className="sidebar-subject-label"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-selected)',
              border: `1px solid ${activeSubjectData.accent}`,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: activeSubjectData.accent,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                color: 'var(--color-primary)',
              }}
            >
              {activeSubjectData.label}
            </span>
          </div>
        </div>

        {/* ── Section navigation ── */}
        <div
          style={{
            padding: 'var(--space-4)',
            flex: 1,
          }}
        >
          <p
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 'var(--space-3)',
            }}
          >
            Sections
          </p>

          <nav aria-label="Content sections">
            {SECTION_GROUPS.map((group, gi) => (
              <React.Fragment key={gi}>
                {gi > 0 && (
                  <div
                    aria-hidden="true"
                    style={{
                      height: 1,
                      background: 'var(--border-subtle)',
                      marginBlock: 'var(--space-2)',
                    }}
                  />
                )}
                <ul role="list" style={{ listStyle: 'none' }}>
                  {group.options.map((opt) => {
                    const isActive = opt.value === activeSection;
                    return (
                      <li key={opt.value}>
                        <button
                          type="button"
                          aria-current={isActive ? 'true' : undefined}
                          onClick={() => {
                            onSectionChange(opt.value as SectionId);
                            /* auto-close on mobile after selection */
                            onClose();
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            padding: '8px var(--space-3)',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: isActive
                              ? 'var(--bg-selected)'
                              : 'transparent',
                            color: isActive
                              ? 'var(--color-primary)'
                              : 'var(--text-secondary)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: isActive ? 500 : 400,
                            fontFamily: 'var(--font-sans)',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: [
                              'background-color var(--transition-fast)',
                              'color var(--transition-fast)',
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
                          {/* Active indicator bar */}
                          <span
                            aria-hidden="true"
                            style={{
                              width: 3,
                              height: 16,
                              borderRadius: 'var(--radius-full)',
                              background: isActive
                                ? activeSubjectData.accent
                                : 'transparent',
                              marginRight: 10,
                              flexShrink: 0,
                              transition: 'background-color var(--transition-fast)',
                            }}
                          />
                          {opt.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* ── Bottom: theme toggle (mobile only) ── */}
        <div
          className="sidebar-theme-row"
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-tertiary)',
            }}
          >
            Theme
          </span>
          <ThemeToggle />
        </div>
      </aside>

      {/* ── Responsive styles ── */}
      <style>{`
        /* Desktop ≥ 400px: sidebar always visible, no slide */
        @media (min-width: 400px) {
          .sidebar-panel {
            transform: none !important;
            pointer-events: auto !important;
            aria-hidden: false !important;
          }
          .sidebar-backdrop        { display: none !important; }
          .sidebar-theme-row       { display: none !important; }
          .sidebar-subject-dropdown { display: none !important; }
          .sidebar-subject-label   { display: inline-flex !important; }
        }

        /* Mobile < 400px: sidebar slides in/out */
        @media (max-width: 399px) {
          .sidebar-panel {
            transform: translateX(-100%);
            transition: transform var(--transition-slow);
            pointer-events: none;
            top: 0;          /* covers full height under navbar */
            padding-top: var(--navbar-height);
          }
          .sidebar-panel[aria-hidden="true"] {
            transform: translateX(-100%);
            pointer-events: none;
          }
          .sidebar-panel:not([aria-hidden]) {
            transform: translateX(0);
            pointer-events: auto;
          }
          .sidebar-subject-label   { display: none !important; }
          .sidebar-subject-dropdown { display: block !important; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}