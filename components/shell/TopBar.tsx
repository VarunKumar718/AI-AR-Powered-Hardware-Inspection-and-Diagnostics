'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  Info,
  ChevronDown,
  Cpu,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';
import { NAV_ITEMS } from './Sidebar';

export const TopBar: React.FC = () => {
  const pathname = usePathname();
  const {
    setCommandPaletteOpen,
    setAboutModalOpen,
    activeBoard,
    setActiveBoard,
    boards,
    addToast,
  } = useVisionStore();

  const [isBoardDropdownOpen, setIsBoardDropdownOpen] = useState(false);

  const currentNav = NAV_ITEMS.find((n) => n.href === pathname) || {
    name: 'Inspection Studio',
    href: '/studio',
  };

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between gap-4 z-20 shrink-0 select-none">
      {/* Left: Breadcrumbs & Board Selector */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
          <span className="font-mono text-slate-400 dark:text-slate-500 uppercase">VG-01</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <h1 className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate">
            {currentNav.name}
          </h1>
        </div>

        {/* Board Switcher Dropdown */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setIsBoardDropdownOpen(!isBoardDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="truncate max-w-[140px] md:max-w-[190px]">{activeBoard.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isBoardDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-1 z-50">
              <div className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1">
                Select Active Board Test Sample
              </div>
              {boards.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveBoard(b.id);
                    setIsBoardDropdownOpen(false);
                    addToast({
                      type: 'info',
                      title: 'Board Target Loaded',
                      message: `Loaded ${b.name}`,
                    });
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex flex-col gap-0.5 transition-colors ${
                    b.id === activeBoard.id
                      ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-medium'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="font-medium">{b.name}</span>
                  <span className="text-[10px] text-slate-400 truncate">{b.mcu}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-md hidden lg:block">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-400 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search components, pins, defects, datasheets...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Simulated Demo Data Badge */}
        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium text-[#B45309] bg-[#FEF3C7] border border-[#FDE68A]">
          Simulated Demo Data
        </span>

        {/* About Demo Button */}
        <button
          onClick={() => setAboutModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200"
        >
          <Info className="w-3.5 h-3.5" />
          <span>About Demo</span>
        </button>

        {/* Bell Notifications */}
        <button
          onClick={() =>
            addToast({
              type: 'info',
              title: 'System Notifications',
              message: 'Inspection engine operating normally with 0 background warnings.',
            })
          }
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-teal-600" />
        </button>

        {/* User Avatar */}
        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-medium text-slate-700 dark:text-slate-300">
          EE
        </div>
      </div>
    </header>
  );
};
