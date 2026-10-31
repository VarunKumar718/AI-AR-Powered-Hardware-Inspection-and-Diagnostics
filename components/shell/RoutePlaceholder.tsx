'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-md">
                {badge}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Active Target: {activeBoard.name}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                {title}
              </h1>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href={actionHref}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs transition-colors shadow-sm"
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
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-1 shadow-sm"
            >
              <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">
                {s.label}
              </span>
              <span className="text-xl md:text-2xl font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                {s.value}
              </span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">{s.detail}</span>
            </div>
          ))}
        </div>
      )}

      {/* Feature Capabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between gap-3 shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-semibold">
                  0{idx + 1}
                </span>
                {feat.tag && (
                  <span className="text-[10px] uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {feat.tag}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
