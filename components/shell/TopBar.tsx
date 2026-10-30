'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  Info,
  SlidersHorizontal,
  ChevronDown,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';
import { NAV_ITEMS } from './Sidebar';

export const TopBar: React.FC = () => {
  const pathname = usePathname();
  const {
    aiMode,
    setAiMode,
    setCommandPaletteOpen,
    setAboutModalOpen,
    activeBoard,
    setActiveBoard,
    boards,
    addToast,
  } = useVisionStore();

  const [isBoardDropdownOpen, setIsBoardDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Match current route name
  const currentNav = NAV_ITEMS.find((n) => n.href === pathname) || {
    name: 'Inspection Studio',
    href: '/studio',
  };

  return (
    <header className="h-16 bg-bg-base/80 backdrop-blur-md border-b border-border-subtle px-4 md:px-6 flex items-center justify-between gap-4 z-20 shrink-0 select-none">
      {/* Left: Breadcrumbs & Board Selector */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 text-sm text-text-secondary truncate">
          <span className="font-mono text-xs text-brand-cyan tracking-wider uppercase">VG-01</span>
          <span className="text-border-strong">/</span>
          <h1 className="font-display font-semibold text-text-primary text-base truncate">
            {currentNav.name}
          </h1>
        </div>

        {/* Board Switcher Dropdown */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setIsBoardDropdownOpen(!isBoardDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-bg-card border border-border-subtle hover:border-cyan-500/40 text-xs font-mono text-text-primary transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="truncate max-w-[140px] md:max-w-[190px]">{activeBoard.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          </button>

          {isBoardDropdownOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-bg-card border border-border-strong rounded-xl shadow-2xl p-1.5 z-50">
              <div className="text-[10px] font-mono uppercase text-text-muted px-2 py-1">
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
                      message: `Loaded ${b.name} (${b.detections.length} detections, ${b.defects.length} defects).`,
                    });
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex flex-col gap-0.5 transition-colors ${
                    b.id === activeBoard.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'hover:bg-bg-elevated text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="font-semibold">{b.name}</span>
                  <span className="text-[10px] text-text-muted truncate">{b.mcu}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Command Palette Search Bar */}
      <div className="flex-1 max-w-md hidden lg:block">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-bg-card/70 hover:bg-bg-card border border-border-subtle hover:border-cyan-500/40 text-xs text-text-muted transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-text-muted group-hover:text-brand-cyan transition-colors" />
            <span>Search components, pins, defects, datasheets...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] bg-bg-elevated text-text-secondary px-2 py-0.5 rounded border border-border-subtle">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Search trigger for mobile */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-transparent hover:border-border-subtle"
          aria-label="Open search"
        >
          <Search className="w-4 h-4 text-brand-cyan" />
        </button>

        {/* Persistent AI Mode Pill (Critical Requirement) */}
        <button
          onClick={() => {
            const nextMode = aiMode === 'simulated' ? 'model' : 'simulated';
            setAiMode(nextMode);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold transition-all border ${
            aiMode === 'simulated'
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
          }`}
          title="Click to toggle AI Engine Mode"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              aiMode === 'simulated' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-ping'
            }`}
          />
          <span className="hidden sm:inline">
            {aiMode === 'simulated' ? 'SIMULATED DEMO DATA' : 'LIVE MODEL ACTIVE'}
          </span>
          <span className="sm:hidden">
            {aiMode === 'simulated' ? 'SIM' : 'LIVE'}
          </span>
        </button>

        {/* About This Demo Button */}
        <button
          onClick={() => setAboutModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary bg-bg-card hover:bg-bg-elevated border border-border-subtle hover:border-border-strong transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-brand-cyan" />
          <span className="hidden md:inline">About Demo</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-transparent hover:border-border-subtle transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-cyan" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-bg-card border border-border-strong rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <span className="font-semibold text-xs text-text-primary">System Notifications</span>
                <span className="text-[10px] font-mono text-brand-cyan">3 New</span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-bg-base/70 border border-border-subtle">
                  <div className="font-semibold text-amber-300">IPC Defect Alert</div>
                  <div className="text-text-muted text-[11px] mt-0.5">
                    Critical solder bridge detected on ICSP Header 1 (VCC to MISO short).
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-bg-base/70 border border-border-subtle">
                  <div className="font-semibold text-brand-cyan">Knowledge Base Synced</div>
                  <div className="text-text-muted text-[11px] mt-0.5">
                    ATmega328P datasheet electrical limits and pinout database updated.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Engineer Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-border-subtle">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] shrink-0">
            <div className="w-full h-full rounded-full bg-bg-elevated flex items-center justify-center font-mono text-xs font-bold text-cyan-300">
              EE
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
