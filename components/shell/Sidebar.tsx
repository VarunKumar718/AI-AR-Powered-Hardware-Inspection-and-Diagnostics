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
  const { isSidebarCollapsed, toggleSidebar } = useVisionStore();

  return (
    <aside
      className={`hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-150 z-30 select-none ${
        isSidebarCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-3.5 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-center shrink-0">
            <ScanEye className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>

          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                VisionGuard
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                Hardware AI OS
              </span>
            </div>
          )}
        </Link>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors ${
                isActive
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isSidebarCollapsed ? item.name : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'
                }`}
              />
              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.name}</span>
                  {item.isPrimary && (
                    <span className="text-[10px] uppercase font-medium bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 px-1.5 py-0.2 rounded">
                      Live
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Status Card */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-lg p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
              Edge Engine
            </span>
            <span className="text-[10px] font-medium text-[#B45309] bg-[#FEF3C7] border border-[#FDE68A] px-1.5 py-0.2 rounded">
              SIM DEMO
            </span>
          </div>

          {!isSidebarCollapsed && (
            <div className="space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex justify-between items-center">
                <span>Model:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">Sim-v1.4</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Latency:</span>
                <span className="font-mono text-teal-600 dark:text-teal-400">210 ms</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
