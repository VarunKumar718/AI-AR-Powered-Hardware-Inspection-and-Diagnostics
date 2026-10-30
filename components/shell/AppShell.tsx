'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { CommandPalette } from './CommandPalette';
import { AboutDemoModal } from './AboutDemoModal';
import { ToastContainer } from './ToastContainer';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-deepest text-text-primary circuit-pattern">
      {/* Desktop Left Collapsible Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Header Bar */}
        <TopBar />

        {/* Scrollable Main Workspace Canvas */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8 scrollbar-thin">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileNav />
      </div>

      {/* Global Modals & Notifications */}
      <CommandPalette />
      <AboutDemoModal />
      <ToastContainer />
    </div>
  );
};
