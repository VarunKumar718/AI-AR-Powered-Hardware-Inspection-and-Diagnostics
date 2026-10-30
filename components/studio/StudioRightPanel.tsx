'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ListFilter,
  Info,
  Layers,
  FileCheck2,
  Search,
  ArrowUpDown,
  ExternalLink,
  Bot,
  PlusCircle,
  Cpu,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  X,
  FileText,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { useVisionStore, RightPanelTab, SortOption } from '@/store/useVisionStore';
import { HARDWARE_COMPONENTS } from '@/data/components';
import { ARDUINO_UNO_PINOUT_GROUPS } from '@/data/pinouts';
import { ProvenanceBadge } from '@/components/shell/ProvenanceBadge';
import { formatConfidence, getCategoryBadge, getSeverityBadge } from '@/lib/utils';
import { Detection } from '@/types';

export const StudioRightPanel: React.FC = () => {
  const router = useRouter();
  const {
    activeBoard,
    rightPanelTab,
    setRightPanelTab,
    selectedDetectionId,
    selectDetection,
    selectedDefectId,
    selectDefect,
    minConfidence,
    categoryFilter,
    isRightPanelCollapsed,
    toggleRightPanel,
    addToast,
  } = useVisionStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('confidence');

  // Currently selected detection & component details
  const selectedDetection = activeBoard.detections.find((d) => d.id === selectedDetectionId);
  const matchedComponent = selectedDetection
    ? HARDWARE_COMPONENTS.find((c) => c.id === selectedDetection.componentId)
    : HARDWARE_COMPONENTS[0];

  // Currently selected defect
  const selectedDefect = activeBoard.defects.find((d) => d.id === selectedDefectId);

  // Filter & sort detections list
  const filteredDetections = activeBoard.detections
    .filter((d) => {
      if (d.confidence < minConfidence) return false;
      if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.label.toLowerCase().includes(q) ||
          d.designator?.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'confidence') return b.confidence - a.confidence;
      if (sortOption === 'name') return a.label.localeCompare(b.label);
      if (sortOption === 'category') return a.category.localeCompare(b.category);
      if (sortOption === 'position') return a.bbox.x - b.bbox.x;
      return 0;
    });

  // Health score calculation & letter grade
  const healthScore = activeBoard.healthScore;
  const letterGrade =
    healthScore >= 95 ? 'A+' : healthScore >= 85 ? 'A' : healthScore >= 70 ? 'B' : healthScore >= 50 ? 'C' : 'F';

  if (isRightPanelCollapsed) {
    return (
      <div className="hidden lg:flex w-12 bg-bg-card border-l border-border-subtle flex-col items-center py-4 shrink-0 z-20">
        <button
          onClick={toggleRightPanel}
          className="p-2 rounded-lg bg-bg-elevated text-brand-cyan hover:bg-cyan-500/20 transition-colors"
          title="Expand Details Panel"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="[writing-mode:vertical-rl] text-xs font-mono tracking-widest text-text-muted mt-8 uppercase rotate-180">
          Component Details
        </span>
      </div>
    );
  }

  return (
    <aside className="w-full lg:w-[380px] bg-bg-card/95 border-l border-border-subtle flex flex-col shrink-0 h-full overflow-hidden z-20 select-none">
      {/* 4 Primary Navigation Tabs */}
      <div className="grid grid-cols-4 border-b border-border-subtle text-xs font-mono font-medium bg-bg-base/60">
        <button
          onClick={() => setRightPanelTab('components')}
          className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-all ${
            rightPanelTab === 'components'
              ? 'border-brand-cyan text-cyan-300 font-bold bg-cyan-500/10'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
          title="Detected Components List"
        >
          <ListFilter className="w-4 h-4" />
          <span className="text-[11px] truncate">Detections</span>
        </button>

        <button
          onClick={() => setRightPanelTab('details')}
          className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-all ${
            rightPanelTab === 'details'
              ? 'border-brand-cyan text-cyan-300 font-bold bg-cyan-500/10'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
          title="Component Specifications & Failure Modes"
        >
          <Info className="w-4 h-4" />
          <span className="text-[11px] truncate">Specs</span>
        </button>

        <button
          onClick={() => setRightPanelTab('pinouts')}
          className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-all ${
            rightPanelTab === 'pinouts'
              ? 'border-brand-cyan text-cyan-300 font-bold bg-cyan-500/10'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
          title="Interactive Pinout Matrix"
        >
          <Layers className="w-4 h-4" />
          <span className="text-[11px] truncate">Pinouts</span>
        </button>

        <button
          onClick={() => setRightPanelTab('report')}
          className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-all ${
            rightPanelTab === 'report'
              ? 'border-brand-cyan text-cyan-300 font-bold bg-cyan-500/10'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
          title="Quick Inspection Health Summary"
        >
          <FileCheck2 className="w-4 h-4" />
          <span className="text-[11px] truncate">Health</span>
        </button>
      </div>

      {/* Tab Panels Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {/* TAB 1: DETECTED COMPONENTS LIST */}
        {rightPanelTab === 'components' && (
          <div className="space-y-3">
            {/* Search and Sort Toolbar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter detections..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-bg-base border border-border-subtle text-xs text-text-primary outline-none focus:border-cyan-400 placeholder:text-text-muted"
                />
              </div>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-2 py-1.5 rounded-xl bg-bg-base border border-border-subtle text-xs font-mono text-text-secondary outline-none"
              >
                <option value="confidence">By Conf</option>
                <option value="name">By Name</option>
                <option value="category">By Type</option>
                <option value="position">By Pos</option>
              </select>
            </div>

            {/* List of Detection Cards */}
            <div className="space-y-2">
              {filteredDetections.map((d) => {
                const isSelected = selectedDetectionId === d.id;
                const catBadge = getCategoryBadge(d.category);
                const hasDefect = d.defectIds && d.defectIds.length > 0;

                return (
                  <div
                    key={d.id}
                    onClick={() => selectDetection(d.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400/60 shadow-cyan-glow'
                        : hasDefect
                        ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-400/60'
                        : 'bg-bg-base/70 border-border-subtle hover:border-cyan-500/40 hover:bg-bg-elevated/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs font-bold text-brand-cyan shrink-0">
                          {d.designator || 'NODE'}
                        </span>
                        <span className="text-xs font-semibold text-text-primary truncate">
                          {d.label}
                        </span>
                      </div>
                      <ProvenanceBadge source={d.source} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${catBadge.color}`}>
                        {catBadge.label}
                      </span>

                      <div className="flex items-center gap-2">
                        {hasDefect && (
                          <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-500/40">
                            ANOMALY
                          </span>
                        )}
                        <span className="text-emerald-400 font-bold tabular-nums">
                          {formatConfidence(d.confidence)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar for Confidence */}
                    <div className="w-full h-1 bg-bg-deepest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                        style={{ width: `${d.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: COMPONENT DETAILS & SPECS */}
        {rightPanelTab === 'details' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {matchedComponent ? (
              <>
                {/* Component Title & Part Header */}
                <div className="p-4 rounded-2xl bg-bg-base/90 border border-border-subtle space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-brand-cyan">
                      {selectedDetection?.designator || 'U?'} • {matchedComponent.genericName}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-bg-elevated px-2 py-0.5 rounded text-text-secondary border border-border-subtle">
                      {matchedComponent.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text-primary leading-tight">
                    {matchedComponent.name}
                  </h3>

                  <div className="text-xs font-mono text-text-muted flex items-center justify-between">
                    <span>MPN: <strong className="text-text-secondary">{matchedComponent.mpn}</strong></span>
                    <span>Mfr: <strong className="text-text-secondary">{matchedComponent.manufacturer.split(' ')[0]}</strong></span>
                  </div>
                </div>

                {/* Plain-Language Purpose */}
                <div className="p-3.5 rounded-xl bg-bg-base/70 border border-border-subtle space-y-1">
                  <div className="text-[11px] font-mono uppercase text-brand-cyan font-semibold">
                    Engineering Function
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {matchedComponent.typicalUse}
                  </p>
                </div>

                {/* Key Electrical Specs Table */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono uppercase text-text-muted font-semibold">
                    Electrical Specifications
                  </div>
                  <div className="rounded-xl border border-border-subtle overflow-hidden text-xs font-mono divide-y divide-border-subtle bg-bg-base/60">
                    <div className="p-2 flex justify-between">
                      <span className="text-text-muted">Package:</span>
                      <span className="text-text-primary">{matchedComponent.package}</span>
                    </div>
                    <div className="p-2 flex justify-between">
                      <span className="text-text-muted">Operating Voltage:</span>
                      <span className="text-emerald-400 font-bold">{matchedComponent.operatingVoltage}</span>
                    </div>
                    {Object.entries(matchedComponent.keySpecs).slice(0, 4).map(([key, val], idx) => (
                      <div key={idx} className="p-2 flex justify-between gap-2">
                        <span className="text-text-muted truncate">{key}:</span>
                        <span className="text-text-primary text-right truncate">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Failure Modes & Suggested Checks */}
                {matchedComponent.failureModes && matchedComponent.failureModes.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono uppercase text-rose-400 font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Failure Modes & Diagnostic Checks</span>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs space-y-2">
                      <div className="font-semibold text-rose-300">
                        {matchedComponent.failureModes[0].symptom}
                      </div>
                      <div className="text-[11px] text-text-secondary">
                        <strong>Probable Cause:</strong> {matchedComponent.failureModes[0].probableCause}
                      </div>
                      <div className="p-2 rounded-lg bg-bg-base/70 border border-rose-500/20 text-[11px] text-rose-200">
                        <strong>Multimeter Check:</strong> {matchedComponent.failureModes[0].diagnosticCheck}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <button
                      onClick={() => {
                        addToast({
                          type: 'success',
                          title: 'Added to BOM',
                          message: `Added 1x ${matchedComponent.mpn} to bill of materials.`,
                        });
                      }}
                      className="py-2 px-3 rounded-xl bg-bg-elevated hover:bg-bg-card border border-border-subtle text-text-primary flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Add to BOM</span>
                    </button>

                    <button
                      onClick={() => router.push('/assistant')}
                      className="py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Ask AI Copilot</span>
                    </button>
                  </div>

                  <Link
                    href="/components"
                    className="w-full py-2 px-3 rounded-xl bg-bg-base border border-border-subtle text-xs font-mono text-text-muted hover:text-text-primary flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View in Full Component Library</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-xs text-text-muted">
                Select a component bounding box on the canvas to view detailed electrical specifications.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PINOUT MATRIX */}
        {rightPanelTab === 'pinouts' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3.5 rounded-xl bg-bg-base/80 border border-border-subtle space-y-1">
              <span className="text-xs font-mono font-bold text-brand-cyan">
                Arduino Uno R3 Header Pin Matrix
              </span>
              <p className="text-[11px] text-text-secondary">
                Logic voltage: 5.0V • Current limit: 20mA recommended / 40mA absolute max.
              </p>
            </div>

            <div className="space-y-3">
              {ARDUINO_UNO_PINOUT_GROUPS.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1.5">
                  <div className="text-[11px] font-mono text-text-muted uppercase font-semibold">
                    {group.headerName.split(' (')[0]}
                  </div>
                  <div className="rounded-xl border border-border-subtle divide-y divide-border-subtle bg-bg-base/60 text-xs font-mono">
                    {group.pins.map((pin, pIdx) => (
                      <div key={pIdx} className="p-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-text-muted text-[10px]">{pin.pinNumber}</span>
                          <span className="font-bold text-text-primary">{pin.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          {pin.isPWM && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">
                              PWM
                            </span>
                          )}
                          {pin.busType && (
                            <span className="px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                              {pin.busType}
                            </span>
                          )}
                          <span className="text-emerald-400">{pin.voltageMax}V</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: QUICK REPORT & HEALTH GRADE */}
        {rightPanelTab === 'report' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Health Score Circular Badge */}
            <div className="p-5 rounded-2xl bg-bg-base/90 border border-border-subtle flex flex-col items-center justify-center text-center space-y-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#1E293B"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={healthScore >= 90 ? '#34D399' : healthScore >= 60 ? '#FBBF24' : '#F87171'}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - healthScore / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center font-mono">
                  <span className="text-3xl font-extrabold text-text-primary">{letterGrade}</span>
                  <span className="text-xs text-text-muted">{healthScore.toFixed(0)}%</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-text-primary">
                  {healthScore >= 90 ? 'Assembly Meets IPC Class 3' : 'Actionable Anomalies Detected'}
                </h4>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  {activeBoard.defects.length === 0
                    ? 'All solder fillets, orientation marks, and pin coplanarities verified.'
                    : `${activeBoard.defects.length} potential defects flag verification before power-on.`}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-bg-base/70 border border-border-subtle">
                <div className="text-[10px] text-text-muted uppercase">Components</div>
                <div className="text-lg font-bold text-brand-cyan">{activeBoard.detections.length} Nodes</div>
              </div>
              <div className="p-3 rounded-xl bg-bg-base/70 border border-border-subtle">
                <div className="text-[10px] text-text-muted uppercase">Flagged Defects</div>
                <div className={`text-lg font-bold ${activeBoard.defects.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {activeBoard.defects.length} Issues
                </div>
              </div>
            </div>

            {/* Top Issues List */}
            {activeBoard.defects.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono uppercase text-rose-400 font-semibold">
                  Top Priority Action Items
                </div>
                <div className="space-y-2">
                  {activeBoard.defects.map((def) => {
                    const sev = getSeverityBadge(def.severity);
                    return (
                      <div
                        key={def.id}
                        onClick={() => selectDefect(def.id)}
                        className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 hover:border-rose-400/60 cursor-pointer text-xs space-y-1 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-rose-300">{def.id}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${sev.bg} ${sev.text} ${sev.border}`}>
                            {sev.label}
                          </span>
                        </div>
                        <div className="text-text-primary text-[11px] font-semibold">{def.type}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Open Full Report Button */}
            <Link
              href="/reports"
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-bg-deepest font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-cyan-glow"
            >
              <span>Open Detailed Compliance Report</span>
              <ArrowUpDown className="w-3.5 h-3.5 rotate-90" />
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};
