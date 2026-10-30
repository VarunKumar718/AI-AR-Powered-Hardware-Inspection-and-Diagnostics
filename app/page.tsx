'use client';

import React from 'react';
import Link from 'next/link';
import {
  ScanEye,
  ShieldAlert,
  Cpu,
  Layers,
  ArrowRight,
  Activity,
  History,
  FileCheck,
  Bot,
  Zap,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';
import { INSPECTION_HISTORY } from '@/data/history';
import { ProvenanceBadge } from '@/components/shell/ProvenanceBadge';

export default function DashboardPage() {
  const { activeBoard, setActiveBoard, boards, setAboutModalOpen } = useVisionStore();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-bg-card via-bg-elevated to-bg-card border border-border-strong p-6 md:p-10 shadow-card-glass">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                Computer Vision & Edge AI
              </span>
              <ProvenanceBadge source="simulated" />
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-bold text-text-primary tracking-tight">
              Vision<span className="text-brand-cyan">Guard</span> Command Center
            </h1>

            <p className="text-sm md:text-base text-text-secondary leading-relaxed">
              AI & AR-powered visual hardware inspection, automatic component localization,
              pinout verification, and IPC-A-610 defect detection in the browser.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-bg-deepest font-semibold text-sm transition-all shadow-cyan-glow hover:scale-105 active:scale-95"
              >
                <ScanEye className="w-4 h-4" />
                <span>Launch Inspection Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setAboutModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-bg-card hover:bg-bg-elevated text-text-primary font-medium text-sm border border-border-subtle hover:border-cyan-500/40 transition-colors"
              >
                <span>About System Architecture</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="p-5 rounded-2xl bg-bg-base/80 border border-border-subtle shrink-0 flex flex-col gap-3 min-w-[240px]">
            <div className="text-xs font-mono text-text-muted uppercase">System Status</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Engine Mode:</span>
              <span className="text-xs font-mono font-bold text-amber-300">Simulated Edge</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Target Boards:</span>
              <span className="text-xs font-mono font-bold text-brand-cyan">{boards.length} Loaded</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Catalog Parts:</span>
              <span className="text-xs font-mono font-bold text-emerald-400">25+ Datasheets</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">Network Calls:</span>
              <span className="text-xs font-mono font-bold text-text-primary">0 (100% Offline)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Boards Quick Launch Carousel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-lg font-display font-bold text-text-primary">
              Hardware Inspection Targets
            </h2>
          </div>
          <span className="text-xs font-mono text-text-muted">
            Select a board to launch studio canvas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {boards.map((b) => (
            <div
              key={b.id}
              onClick={() => setActiveBoard(b.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                b.id === activeBoard.id
                  ? 'bg-bg-elevated border-cyan-400/50 shadow-cyan-glow'
                  : 'bg-bg-card border-border-subtle hover:border-cyan-500/30 hover:bg-bg-card/90'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-bg-base px-2 py-0.5 rounded text-brand-cyan border border-border-subtle">
                    {b.category.replace('_', ' ')}
                  </span>
                  {b.defects.length > 0 ? (
                    <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-500/40">
                      {b.defects.length} Defects
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/40">
                      Passed
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-text-primary">
                  {b.name}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2">
                  {b.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-mono">
                <span className="text-text-muted">{b.detections.length} components</span>
                <Link
                  href="/studio"
                  className="text-brand-cyan hover:underline flex items-center gap-1 font-semibold"
                >
                  Inspect <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Inspection Activity Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand-cyan" />
            <h2 className="text-lg font-display font-bold text-text-primary">
              Recent Inspection History
            </h2>
          </div>
          <Link href="/history" className="text-xs font-mono text-brand-cyan hover:underline">
            View all 14 records →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INSPECTION_HISTORY.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-bg-card border border-border-subtle hover:border-cyan-500/30 transition-all flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-text-muted">{item.id}</span>
                  <span
                    className={`font-mono font-bold ${
                      item.healthScore >= 90 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    Score: {item.healthScore.toFixed(0)}%
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-text-primary">{item.boardName}</h4>
                <p className="text-xs text-text-secondary line-clamp-2">{item.summary}</p>
              </div>
              <div className="text-[11px] font-mono text-text-muted pt-2 border-t border-border-subtle flex justify-between">
                <span>{item.inspectionDate}</span>
                <span className="text-brand-cyan">{item.durationMs}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
