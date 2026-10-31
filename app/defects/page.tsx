'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  Wrench,
  Search,
  ChevronRight,
  Filter,
  Eye,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';
import { Defect, DefectSeverity, DefectStatus } from '@/types';
import Link from 'next/link';

export default function DefectsPage() {
  const { activeBoard, activeDefects, selectDefect } = useVisionStore();
  const [severityFilter, setSeverityFilter] = useState<DefectSeverity | 'all'>('all');
  const [localStatuses, setLocalStatuses] = useState<Record<string, DefectStatus>>({});
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(
    activeDefects.length > 0 ? activeDefects[0] : null
  );

  const filteredDefects = activeDefects.filter((def) => {
    if (severityFilter === 'all') return true;
    return def.severity === severityFilter;
  });

  const handleStatusChange = (defectId: string, status: DefectStatus) => {
    setLocalStatuses((prev) => ({ ...prev, [defectId]: status }));
  };

  const getStatus = (defect: Defect): DefectStatus => {
    return localStatuses[defect.id] || defect.status || 'new';
  };

  const getSeverityBadge = (sev: DefectSeverity) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-950/70 text-red-300 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.25)]';
      case 'high':
        return 'bg-amber-950/70 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.25)]';
      case 'medium':
        return 'bg-yellow-950/70 text-yellow-300 border-yellow-500/40';
      case 'low':
        return 'bg-blue-950/70 text-blue-300 border-blue-500/40';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-600';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-bg-card via-bg-elevated to-bg-card border border-border-strong p-6 md:p-8 shadow-card-glass">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-semibold">
                Optical Defect Audit
              </span>
              <span className="text-xs font-mono text-text-muted">
                Target: {activeBoard.name} ({activeDefects.length} Flags Detected)
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight">
              IPC-A-610 Automated Defect Inspector
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Real-time classification of solder bridges, missing passive parts, mechanical pin bends, and thermal substrate degradation adhering to IPC Class 2 and Class 3 electronics acceptability standards.
            </p>
          </div>

          <Link
            href="/studio"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-bg-deepest font-semibold text-xs transition-all shadow-cyan-glow shrink-0"
          >
            <span>Inspect On Canvas</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2. Severity Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-bg-card border border-border-subtle rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-mono text-text-muted flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-brand-cyan" />
            Severity Filter:
          </span>
          {(
            [
              { id: 'all', label: 'All Defect Classes' },
              { id: 'critical', label: 'Critical Shorts' },
              { id: 'high', label: 'High Priority' },
              { id: 'medium', label: 'Medium' },
              { id: 'low', label: 'Low / Cosmetic' },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => setSeverityFilter(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                severityFilter === s.id
                  ? 'bg-cyan-500/20 text-brand-cyan border border-cyan-500/40 font-semibold'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-text-muted">
          Showing {filteredDefects.length} of {activeDefects.length} anomalies
        </span>
      </div>

      {/* 3. Defects Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Defect Cards List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredDefects.map((def) => {
            const isSelected = selectedDefect?.id === def.id;
            const currentStatus = getStatus(def);
            return (
              <div
                key={def.id}
                onClick={() => setSelectedDefect(def)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-bg-elevated/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'bg-bg-card hover:bg-bg-elevated/60 border-border-subtle hover:border-border-strong'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-bold ${getSeverityBadge(def.severity)}`}>
                      {def.severity}
                    </span>
                    <span className="font-mono font-bold text-sm text-text-primary">
                      {def.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      {(def.confidence * 100).toFixed(1)}% Conf
                    </span>
                    <span className="text-[10px] font-mono text-text-muted bg-bg-deepest border border-border-subtle px-2 py-0.5 rounded">
                      ID: {def.id}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {def.description}
                </p>

                {/* Status Switcher Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border-subtle/50 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-text-muted text-[11px]">Audit Status:</span>
                    {(['confirmed', 'false_positive', 'needs_review'] as DefectStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(def.id, st);
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all border ${
                          currentStatus === st
                            ? st === 'confirmed'
                              ? 'bg-red-950 text-red-300 border-red-500 font-bold'
                              : st === 'false_positive'
                              ? 'bg-gray-800 text-gray-300 border-gray-500 font-bold'
                              : 'bg-amber-950 text-amber-300 border-amber-500 font-bold'
                            : 'bg-bg-deepest text-text-muted border-border-subtle hover:text-text-primary'
                        }`}
                      >
                        {st === 'confirmed' ? 'Confirmed' : st === 'false_positive' ? 'False Positive' : 'Review'}
                      </button>
                    ))}
                  </div>

                  <Link
                    href="/studio"
                    onClick={() => selectDefect(def.id)}
                    className="inline-flex items-center gap-1 text-brand-cyan hover:underline text-[11px]"
                  >
                    <span>Highlight On Canvas</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}

          {filteredDefects.length === 0 && (
            <div className="p-12 text-center text-text-muted text-xs font-mono bg-bg-card rounded-2xl border border-border-subtle">
              No defects match the selected severity filter. Board exhibits clean soldering joints.
            </div>
          )}
        </div>

        {/* Right Col: Defect Remediation & IPC Standards Inspector */}
        <div className="bg-bg-card border border-border-strong rounded-2xl p-5 flex flex-col gap-4 shadow-card-glass h-fit sticky top-20">
          {selectedDefect ? (
            <div className="space-y-4">
              <div className="space-y-1.5 border-b border-border-subtle pb-3">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-bold inline-block ${getSeverityBadge(selectedDefect.severity)}`}>
                  {selectedDefect.severity} ANOMALY
                </span>
                <h2 className="font-mono font-bold text-base text-text-primary">
                  {selectedDefect.type}
                </h2>
                <div className="text-xs font-mono text-text-muted flex items-center justify-between">
                  <span>Confidence: <strong className="text-emerald-400">{(selectedDefect.confidence * 100).toFixed(1)}%</strong></span>
                  <span>Source: <strong className="text-brand-cyan">{selectedDefect.source}</strong></span>
                </div>
              </div>

              {/* Bounding Box Coordinates */}
              <div className="p-3 rounded-xl bg-bg-deepest border border-border-subtle text-xs font-mono space-y-1">
                <span className="text-[10px] text-text-muted uppercase tracking-wider block">
                  Normalized Region Coordinates (0-1)
                </span>
                <div className="grid grid-cols-2 gap-2 text-cyan-200">
                  <div>X: {selectedDefect.region.x.toFixed(4)}</div>
                  <div>Y: {selectedDefect.region.y.toFixed(4)}</div>
                  <div>Width: {selectedDefect.region.w.toFixed(4)}</div>
                  <div>Height: {selectedDefect.region.h.toFixed(4)}</div>
                </div>
              </div>

              {/* IPC Standard Citation */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider block">
                  IPC-A-610 Acceptability Standard Citation
                </span>
                <p className="text-xs text-text-secondary leading-relaxed bg-bg-deepest p-3 rounded-xl border border-border-subtle">
                  Class 3 (High Performance Electronic Products) defect condition: Minimum electrical clearance violated. Solder fillet bridges adjacent conductive traces or component terminals.
                </p>
              </div>

              {/* Diagnostic Check */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Suggested Diagnostic Verification
                </span>
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs font-mono text-amber-200 leading-relaxed">
                  {selectedDefect.suggestedCheck || 'Measure continuity across bridged contacts using digital multimeter in buzzer resistance mode (<1Ω indicates short).'}
                </div>
              </div>

              {/* Recommended Rework Procedure */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-brand-cyan uppercase tracking-wider flex items-center gap-1 font-semibold">
                  <Wrench className="w-3.5 h-3.5" />
                  Recommended Rework Procedure
                </span>
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs font-mono text-cyan-200 leading-relaxed">
                  {selectedDefect.recommendation || 'Apply rosin-core flux (RMA type) and wick away excess alloy using 2.0mm pre-tinned copper desoldering braid at 330°C.'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted text-xs font-mono">
              Select any defect card to inspect its IPC-A-610 classification and rework steps.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
