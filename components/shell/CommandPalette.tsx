'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Cpu,
  Layers,
  AlertTriangle,
  History,
  FileText,
  Sliders,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';
import { HARDWARE_COMPONENTS } from '@/data/components';
import { BOARDS_CATALOG } from '@/data/boards';
import { HARDWARE_DEFECTS } from '@/data/defects';
import { NAV_ITEMS } from './Sidebar';

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setActiveBoard,
    setAiMode,
    aiMode,
    setAboutModalOpen,
    addToast,
  } = useVisionStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K & Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  // Build searchable items
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    const items: {
      id: string;
      title: string;
      subtitle: string;
      category: string;
      icon: any;
      action: () => void;
    }[] = [];

    // 1. Navigation items
    NAV_ITEMS.forEach((nav) => {
      if (!q || nav.name.toLowerCase().includes(q)) {
        items.push({
          id: `nav-${nav.href}`,
          title: nav.name,
          subtitle: `Navigate to ${nav.name}`,
          category: 'Navigation',
          icon: nav.icon,
          action: () => {
            router.push(nav.href);
            setCommandPaletteOpen(false);
          },
        });
      }
    });

    // 2. Hardware components
    HARDWARE_COMPONENTS.forEach((comp) => {
      if (
        !q ||
        comp.name.toLowerCase().includes(q) ||
        comp.mpn.toLowerCase().includes(q) ||
        comp.category.toLowerCase().includes(q)
      ) {
        items.push({
          id: `comp-${comp.id}`,
          title: comp.name,
          subtitle: `${comp.mpn} • ${comp.package} • ${comp.category}`,
          category: 'Components',
          icon: Cpu,
          action: () => {
            router.push('/components');
            setCommandPaletteOpen(false);
            addToast({
              type: 'info',
              title: comp.name,
              message: `Opened datasheet reference for ${comp.mpn}.`,
            });
          },
        });
      }
    });

    // 3. Board samples
    BOARDS_CATALOG.forEach((b) => {
      if (!q || b.name.toLowerCase().includes(q) || b.mcu.toLowerCase().includes(q)) {
        items.push({
          id: `board-${b.id}`,
          title: b.name,
          subtitle: `${b.mcu} • ${b.variant}`,
          category: 'Hardware Targets',
          icon: Layers,
          action: () => {
            setActiveBoard(b.id);
            router.push('/studio');
            setCommandPaletteOpen(false);
            addToast({
              type: 'success',
              title: 'Target Board Loaded',
              message: `Switched target to ${b.name}.`,
            });
          },
        });
      }
    });

    // 4. Defects
    HARDWARE_DEFECTS.forEach((d) => {
      if (
        !q ||
        d.id.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.severity.toLowerCase().includes(q)
      ) {
        items.push({
          id: `defect-${d.id}`,
          title: `${d.id}: ${d.type}`,
          subtitle: `Severity: ${d.severity.toUpperCase()} • ${d.description.slice(0, 50)}...`,
          category: 'Defect Catalog',
          icon: AlertTriangle,
          action: () => {
            router.push('/defects');
            setCommandPaletteOpen(false);
          },
        });
      }
    });

    // 5. System actions
    if (!q || 'toggle simulation real model live'.includes(q)) {
      items.push({
        id: 'action-toggle-mode',
        title: `Switch to ${aiMode === 'simulated' ? 'Live Model' : 'Simulated'} Engine`,
        subtitle: `Currently operating in ${aiMode.toUpperCase()} mode`,
        category: 'Engine Control',
        icon: Sliders,
        action: () => {
          setAiMode(aiMode === 'simulated' ? 'model' : 'simulated');
          setCommandPaletteOpen(false);
        },
      });
    }

    if (!q || 'about demo hackathon architecture'.includes(q)) {
      items.push({
        id: 'action-about-demo',
        title: 'Open "About This Demo" Architecture Modal',
        subtitle: 'View transparent breakdown of Real vs Simulated features',
        category: 'System',
        icon: Info,
        action: () => {
          setCommandPaletteOpen(false);
          setAboutModalOpen(true);
        },
      });
    }

    return items.slice(0, 15);
  }, [
    query,
    router,
    setCommandPaletteOpen,
    setActiveBoard,
    addToast,
    aiMode,
    setAiMode,
    setAboutModalOpen,
  ]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 dark:bg-slate-950/60 transition-opacity"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search components, pinouts, defects..."
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No matching hardware items or actions found for &quot;{query}&quot;.
            </div>
          ) : (
            results.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-md ${
                        isSelected
                          ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {item.category}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with arrows or click to select</span>
          <span className="font-mono text-teal-600 dark:text-teal-400">VisionGuard</span>
        </div>
      </div>
    </div>
  );
};
