'use client';

import React, { useState } from 'react';
import {
  ScanEye,
  Info,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';
import { StudioLeftPanel } from '@/components/studio/StudioLeftPanel';
import { StudioCanvas } from '@/components/studio/StudioCanvas';
import { StudioRightPanel } from '@/components/studio/StudioRightPanel';
import { ProvenanceBadge } from '@/components/shell/ProvenanceBadge';

export default function StudioPage() {
  const { activeBoard, setActiveBoard, boards, addToast } = useVisionStore();
  const [showDismissibleBanner, setShowDismissibleBanner] = useState(true);

  return (
    <div className="flex flex-col h-full -mx-4 -my-6 md:-mx-8 md:-my-8 select-none overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Studio Top Control Strip */}
      <div className="h-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 z-20">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-md bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
            <ScanEye className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2 truncate">
            <h1 className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
              Live Inspection Studio
            </h1>
            <ProvenanceBadge source="simulated" />
          </div>
        </div>

        {/* Board Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {boards.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setActiveBoard(b.id);
                addToast({
                  type: 'info',
                  title: 'Target Board Loaded',
                  message: `Loaded ${b.name}`,
                });
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 border ${
                b.id === activeBoard.id
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-600 dark:border-teal-500'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300'
              }`}
            >
              {b.variant === 'defect_demo' ? '⚠ Uno (Defect Variant B)' : b.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Dismissible Simulation Disclaimer Banner */}
      {showDismissibleBanner && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200/80 dark:border-amber-800/40 px-4 py-1.5 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2 truncate">
            <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="truncate">
              <strong>Simulated Inspection Engine:</strong> Component boxes and defects are rendered by VisionGuard&apos;s
              offline model. Connect a live ONNX/YOLO adapter in <code>lib/ai/</code> to evaluate live weights.
            </span>
          </div>
          <button
            onClick={() => setShowDismissibleBanner(false)}
            className="text-amber-700 hover:text-amber-900 dark:hover:text-amber-100 font-medium text-[11px] ml-4 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main 3-Column Studio Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0 h-full overflow-hidden relative">
        {/* Left Panel: Input & Controls (~300px) */}
        <StudioLeftPanel />

        {/* Center: Main Canvas (Dominant Area) */}
        <div className="flex-1 flex flex-col min-w-0 h-full p-2 sm:p-3 overflow-hidden relative bg-slate-100 dark:bg-slate-950">
          <StudioCanvas />
        </div>

        {/* Right Panel: Detections & Details (~360px) */}
        <StudioRightPanel />
      </div>
    </div>
  );
}
