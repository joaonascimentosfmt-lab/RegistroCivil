'use client';

import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { Footer } from './footer';
import { useSidebar } from '@/lib/hooks/use-sidebar';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Sidebar />
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300 ease-in-out',
          isOpen ? 'ml-64' : 'ml-16'
        )}
      >
        <Topbar />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
