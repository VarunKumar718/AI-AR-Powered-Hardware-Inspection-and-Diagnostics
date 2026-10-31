'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  ScanEye,
  Activity,
  Terminal,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';

interface RoutePlaceholderProps {
  title: string;
  badge: string;
  description: string;
  icon: any;
  actionText?: string;
  actionHref?: string;
  features: { title: string; desc: string; tag?: string }[];
  stats?: { label: string; value: string; detail: string }[];
}

export const RoutePlaceholder: React.FC<RoutePlaceholderProps> = ({
  title,
  badge,
  description,
  icon: Icon,
  actionText = 'Open Inspection Studio',
  actionHref = '/studio',
  features,
  stats,
}) => {
  const { activeBoard } = useVisionStore();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Hero Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-bg-card via-bg-elevated to-bg-card border border-border-strong p-6 md:p-8 shadow-card-glass">
        {/* Subtle ambient cyan glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
                {badge}
              </span>
              <span className="text-xs font-mono text-text-muted">
                Active Target: {activeBoard.name}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-brand-cyan shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight">
                {title}
              </h1>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href={actionHref}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-bg-deepest font-semibold text-xs transition-all shadow-cyan-glow hover:scale-105 active:scale-95"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Bar if provided */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-bg-card border border-border-subtle flex flex-col gap-1"
            >
              <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
                {s.label}
              </span>
              <span className="text-xl md:text-2xl font-mono font-bold text-text-primary tabular-nums">
                {s.value}
              </span>
              <span className="text-[11px] text-brand-cyan">{s.detail}</span>
            </div>
          ))}
        </div>
      )}

      {/* Feature Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-bg-card/70 border border-border-subtle hover:border-cyan-500/30 transition-all flex flex-col justify-between gap-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-brand-cyan font-semibold">
                  0{idx + 1}
                </span>
                {feat.tag && (
                  <span className="text-[10px] font-mono uppercase bg-bg-elevated px-2 py-0.5 rounded text-text-muted border border-border-subtle">
                    {feat.tag}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-text-primary group-hover:text-cyan-300 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {feat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
