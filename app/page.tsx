'use client';

import React from 'react';
import { useAppState } from '@/components/layout/AppShell';
import MainContent from '@/components/layout/MainContent';

export default function Page() {
  const { activeSubject, activeSection } = useAppState();

  return (
    <MainContent
      activeSubject={activeSubject}
      activeSection={activeSection}
    />
  );
}