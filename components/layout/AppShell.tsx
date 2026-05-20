'use client';

import React, { useState } from 'react';
import Navbar, { SUBJECTS, type SubjectId } from '@/components/layout/Navbar';
import Sidebar, { type SectionId } from '@/components/layout/Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [activeSubject, setActiveSubject] = useState<SubjectId>('daa');
  const [activeSection, setActiveSection] = useState<SectionId>('analysis');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleSubjectChange(id: SubjectId) {
    setActiveSubject(id);
    // Reset to first section whenever subject changes
    setActiveSection('analysis');
    setSidebarOpen(false);
  }

  function handleSectionChange(id: SectionId) {
    setActiveSection(id);
  }

  function handleMenuToggle() {
    setSidebarOpen((prev) => !prev);
  }

  function handleSidebarClose() {
    setSidebarOpen(false);
  }

  return (
    <>
      <Navbar
        activeSubject={activeSubject}
        onSubjectChange={handleSubjectChange}
        onMenuToggle={handleMenuToggle}
        sidebarOpen={sidebarOpen}
      />

      <Sidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        activeSubject={activeSubject}
        onSubjectChange={handleSubjectChange}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/*
        Main content area.
        On desktop (≥ 400px): offset left by sidebar width + top by navbar height.
        On mobile (< 400px):  only offset top by navbar height.
        The actual content is rendered by page.tsx via children,
        which receives activeSubject and activeSection via context or props.
        We pass them down via a context so page.tsx can read them
        without prop-drilling through the Next.js layout boundary.
      */}
      <AppStateContext.Provider value={{ activeSubject, activeSection }}>
        <main
          id="main-content"
          role="main"
          aria-label={`${SUBJECTS.find((s) => s.id === activeSubject)?.label} — content`}
          tabIndex={-1}
          className="app-main"
          style={{
            minHeight: '100dvh',
            paddingTop: 'var(--navbar-height)',
            paddingInline: 'var(--space-6)',
            paddingBottom: 'var(--space-12)',
          }}
        >
          {children}
        </main>
      </AppStateContext.Provider>

      <style>{`
        @media (min-width: 400px) {
          .app-main {
            margin-left: var(--sidebar-width);
          }
        }
        @media (max-width: 399px) {
          .app-main {
            margin-left: 0;
            padding-inline: var(--space-4);
          }
        }
      `}</style>
    </>
  );
}

/* ─── App state context ─────────────────────────────────────────────────────── */
/*
  Exported so page.tsx and content components can read the active
  subject and section without prop-drilling through the Next.js
  layout/page boundary.
*/

import { createContext, useContext } from 'react';
import type { SubjectId as _SubjectId, } from '@/components/layout/Navbar';
import type { SectionId as _SectionId } from '@/components/layout/Sidebar';

export interface AppState {
  activeSubject: SubjectId;
  activeSection: SectionId;
}

export const AppStateContext = createContext<AppState>({
  activeSubject: 'daa',
  activeSection: 'analysis',
});

export function useAppState(): AppState {
  return useContext(AppStateContext);
}