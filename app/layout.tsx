import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/ThemeContext';
import AppShell from '@/components/layout/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'CSIT Board Prep',
  description: 'BSc CSIT 5th Semester board exam preparation — all 6 subjects.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}