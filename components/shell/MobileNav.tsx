'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ScanEye,
  Bot,
  Layers,
  Cpu,
} from 'lucide-react';

const MOBILE_TABS = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Studio', href: '/studio', icon: ScanEye, isSpecial: true },
  { name: 'AI Copilot', href: '/assistant', icon: Bot },
  { name: 'Pinouts', href: '/pinouts', icon: Layers },
  { name: 'Parts', href: '/components', icon: Cpu },
];

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 px-2 flex items-center justify-around select-none">
      {MOBILE_TABS.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        if (tab.isSpecial) {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative -top-2 flex flex-col items-center group"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-sm ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] mt-1 ${
                  isActive ? 'text-teal-600 dark:text-teal-400 font-medium' : 'text-slate-500'
                }`}
              >
                {tab.name}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
              isActive
                ? 'text-teal-600 dark:text-teal-400 font-medium'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-1">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
