'use client';

import React, { useState } from 'react';
import {
  ScanEye,
  Info,
  Layers,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
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
    <div className="flex flex-col h-full -mx-4 -my-6 md:-mx-8 md:-my-8 select-none overflow-hidden">
      {/* Studio Top Control Strip */}
      <div className="h-14 bg-bg-base/90 backdrop-blur-md border-b border-border-subtle px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-brand-cyan shrink-0">
            <ScanEye className="w-4 h-4 animate-pulse-subtle" />
          </div>
          <div className="flex items-center gap-2 truncate">
            <h1 className="font-display font-bold text-sm text-text-primary tracking-wide truncate">
              Live Inspection Studio
            </h1>
            <ProvenanceBadge source="simulated" />
          </div>
        </div>

        {/* Board Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
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
              className={`px-3 py-1 rounded-xl text-xs font-mono transition-all shrink-0 border ${
                b.id === activeBoard.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-cyan-glow font-bold'
                  : 'bg-bg-elevated/70 text-text-secondary border-border-subtle hover:text-text-primary hover:border-cyan-500/30'
              }`}
            >
              {b.variant === 'defect_demo' ? '⚠️ Uno (Defect Variant B)' : b.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Dismissible Simulation Disclaimer Banner */}
      {showDismissibleBanner && (
        <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2 text-xs font-mono text-amber-200 flex items-center justify-between shrink-0 z-10 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 truncate">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">
              <strong>Simulated Inspection Engine:</strong> Component boxes & defects are rendered by VisionGuard&apos;s
              offline model. Connect a live ONNX/YOLO adapter in <code>lib/ai/</code> to evaluate live weights.
            </span>
          </div>
          <button
            onClick={() => setShowDismissibleBanner(false)}
            className="text-amber-400 hover:text-amber-200 underline text-[11px] ml-4 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main 3-Column Studio Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0 h-full overflow-hidden relative">
        {/* Left Panel: Input & Controls (~320px) */}
        <StudioLeftPanel />

        {/* Center: Main Canvas (Dominant Area) */}
        <div className="flex-1 flex flex-col min-w-0 h-full p-2 sm:p-4 overflow-hidden relative">
          <StudioCanvas />
        </div>

        {/* Right Panel: Detections & Details (~380px) */}
        <StudioRightPanel />
      </div>
    </div>
  );
}
