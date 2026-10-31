'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ScanEye,
  Bot,
  Cpu,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  History,
  FileBarChart2,
  Activity,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';

export const NAV_ITEMS = [
  { name: 'Welcome', href: '/', icon: Compass },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inspection Studio', href: '/studio', icon: ScanEye, isPrimary: true },
  { name: 'AI Assistant', href: '/assistant', icon: Bot },
  { name: 'Pinout Guide', href: '/pinouts', icon: Layers },
  { name: 'Component Library', href: '/components', icon: Cpu },
  { name: 'BOM Manager', href: '/bom', icon: FileSpreadsheet },
  { name: 'Defect Inspector', href: '/defects', icon: AlertTriangle },
  { name: 'History', href: '/history', icon: History },
  { name: 'Reports', href: '/reports', icon: FileBarChart2 },
  { name: 'Edge AI Status', href: '/edge-ai', icon: Activity },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Docs', href: '/help', icon: HelpCircle },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, isModelConnected, aiMode, lastInferenceMs, device } = useVisionStore();

  return (
    <aside
      className={`hidden md:flex flex-col bg-bg-base/95 backdrop-blur-md border-r border-border-subtle transition-all duration-300 z-30 select-none ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-subtle">
        <Link href="/" className="flex items-center gap-3 overflow-hidden group">
          {/* Stylized Chip / Eye Mark */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 p-[1.5px] shrink-0 shadow-cyan-glow group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-bg-deepest rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-6 h-6 border border-cyan-400/40 rounded-sm" />
              </div>
              <ScanEye className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-text-primary leading-none">
                Vision<span className="text-brand-cyan">Guard</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-text-muted mt-1 uppercase">
                Hardware AI OS
              </span>
            </div>
          )}
        </Link>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors border border-transparent hover:border-border-subtle"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-brand-cyan" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-text-secondary" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <div key={item.href} className="py-1">
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/25 to-teal-500/20 text-cyan-300 border border-cyan-400/50 shadow-cyan-glow'
                      : 'bg-cyan-950/40 text-cyan-300/90 border border-cyan-500/20 hover:border-cyan-400/40 hover:bg-cyan-900/30'
                  }`}
                  title={isSidebarCollapsed ? item.name : undefined}
                >
                  <div className="relative shrink-0 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cyan-400 animate-pulse-subtle" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span className="font-semibold tracking-wide">{item.name}</span>
                      <span className="text-[10px] font-mono uppercase bg-cyan-500/30 text-cyan-200 px-1.5 py-0.5 rounded border border-cyan-400/30">
                        Live
                      </span>
                    </div>
                  )}
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors group relative ${
                isActive
                  ? 'bg-bg-elevated text-brand-cyan border border-border-strong font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/70'
              }`}
              title={isSidebarCollapsed ? item.name : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-brand-cyan' : 'text-text-muted group-hover:text-text-primary'
                }`}
              />
              {!isSidebarCollapsed && (
                <span className="truncate">{item.name}</span>
              )}

              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-brand-cyan" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Status Card */}
      <div className="p-3 border-t border-border-subtle">
        <div className="bg-bg-card border border-border-subtle rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isModelConnected ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isModelConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </span>
              {!isSidebarCollapsed && (
                <span className="text-xs font-mono font-semibold text-text-primary">
                  EDGE ENGINE
                </span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${isModelConnected ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/30' : 'text-amber-300 bg-amber-950/60 border-amber-500/30'}`}>
                {isModelConnected ? 'LIVE YOLO' : 'SIM DEMO'}
              </span>
            )}
          </div>

          {!isSidebarCollapsed && (
            <div className="space-y-1 pt-1 text-[11px] text-text-muted">
              <div className="flex justify-between items-center">
                <span>Inference Engine:</span>
                <span className="font-mono text-text-secondary">
                  {isModelConnected ? 'YOLOv8-PCB' : 'offline / simulation'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Avg Latency:</span>
                <span className={`font-mono ${isModelConnected ? 'text-emerald-400' : 'text-text-muted'}`}>
                  {isModelConnected ? `${lastInferenceMs || 220} ms` : 'offline'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
