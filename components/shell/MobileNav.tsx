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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-base/95 backdrop-blur-lg border-t border-border-subtle z-40 px-2 flex items-center justify-around select-none">
      {MOBILE_TABS.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        if (tab.isSpecial) {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative -top-3 flex flex-col items-center group"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-tr from-cyan-400 to-teal-400 text-bg-deepest shadow-cyan-glow'
                    : 'bg-bg-elevated text-brand-cyan border border-cyan-500/40'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={`text-[10px] font-mono mt-1 ${
                  isActive ? 'text-brand-cyan font-bold' : 'text-text-muted'
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
              isActive ? 'text-brand-cyan font-semibold' : 'text-text-muted hover:text-text-primary'
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
