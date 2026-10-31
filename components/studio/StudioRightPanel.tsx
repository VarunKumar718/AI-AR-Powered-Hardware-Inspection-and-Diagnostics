'use client';

import React, { useState } from 'react';
import {
  ListFilter,
  Info,
  Layers,
  FileCheck2,
  Search,
  ExternalLink,
  Bot,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';
import { useVisionStore, SortOption } from '@/store/useVisionStore';
import { HARDWARE_COMPONENTS } from '@/data/components';
import { ARDUINO_UNO_PINOUT_GROUPS } from '@/data/pinouts';
import { ProvenanceBadge } from '@/components/shell/ProvenanceBadge';
import { formatConfidence, getCategoryBadge, getSeverityBadge } from '@/lib/utils';

export const StudioRightPanel: React.FC = () => {
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

  // Health score calculation
  const healthScore = activeBoard.healthScore;
  const letterGrade =
    healthScore >= 95 ? 'A+' : healthScore >= 85 ? 'A' : healthScore >= 70 ? 'B' : healthScore >= 50 ? 'C' : 'F';

  if (isRightPanelCollapsed) {
    return (
      <div className="hidden lg:flex w-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex-col items-center py-3 shrink-0 z-20">
        <button
          onClick={toggleRightPanel}
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Expand Details Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="[writing-mode:vertical-rl] text-xs font-medium text-slate-400 mt-6 uppercase rotate-180">
          Details
        </span>
      </div>
    );
  }

  return (
    <aside className="w-full lg:w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 h-full overflow-hidden z-20 select-none">
      {/* 4 Primary Navigation Tabs */}
      <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 text-xs font-medium bg-slate-50/60 dark:bg-slate-850">
        <button
          onClick={() => setRightPanelTab('components')}
          className={`py-2.5 px-1.5 flex flex-col items-center gap-1 border-b-2 transition-colors ${
            rightPanelTab === 'components'
              ? 'border-teal-600 text-teal-700 dark:text-teal-300 font-semibold bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          title="Detected Components List"
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span className="text-[11px] truncate">Detections</span>
        </button>

        <button
          onClick={() => setRightPanelTab('details')}
          className={`py-2.5 px-1.5 flex flex-col items-center gap-1 border-b-2 transition-colors ${
            rightPanelTab === 'details'
              ? 'border-teal-600 text-teal-700 dark:text-teal-300 font-semibold bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          title="Component Specifications"
        >
          <Info className="w-3.5 h-3.5" />
          <span className="text-[11px] truncate">Specs</span>
        </button>

        <button
          onClick={() => setRightPanelTab('pinouts')}
          className={`py-2.5 px-1.5 flex flex-col items-center gap-1 border-b-2 transition-colors ${
            rightPanelTab === 'pinouts'
              ? 'border-teal-600 text-teal-700 dark:text-teal-300 font-semibold bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          title="Interactive Pinout Matrix"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="text-[11px] truncate">Pinouts</span>
        </button>

        <button
          onClick={() => setRightPanelTab('report')}
          className={`py-2.5 px-1.5 flex flex-col items-center gap-1 border-b-2 transition-colors ${
            rightPanelTab === 'report'
              ? 'border-teal-600 text-teal-700 dark:text-teal-300 font-semibold bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
          title="Health Summary"
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span className="text-[11px] truncate">Health</span>
        </button>
      </div>

      {/* Tab Panels Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {/* TAB 1: DETECTED COMPONENTS LIST */}
        {rightPanelTab === 'components' && (
          <div className="space-y-2.5">
            {/* Search and Sort Toolbar */}
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter detections..."
                  className="w-full pl-7 pr-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-600 placeholder:text-slate-400"
                />
              </div>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 outline-none"
              >
                <option value="confidence">By Conf</option>
                <option value="name">By Name</option>
                <option value="category">By Type</option>
                <option value="position">By Pos</option>
              </select>
            </div>

            {/* List of Detection Cards */}
            <div className="space-y-1.5">
              {filteredDetections.map((d) => {
                const isSelected = selectedDetectionId === d.id;
                const catBadge = getCategoryBadge(d.category);
                const hasDefect = d.defectIds && d.defectIds.length > 0;

                return (
                  <div
                    key={d.id}
                    onClick={() => selectDetection(d.id)}
                    className={`p-2.5 rounded-lg border transition-colors cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-teal-50/60 dark:bg-teal-950/30 border-teal-600 dark:border-teal-500'
                        : hasDefect
                        ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                        : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-400 shrink-0">
                          {d.designator || 'NODE'}
                        </span>
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                          {d.label}
                        </span>
                      </div>
                      <ProvenanceBadge source={d.source} />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${catBadge.color}`}>
                        {catBadge.label}
                      </span>

                      <div className="flex items-center gap-2">
                        {hasDefect && (
                          <span className="text-[10px] font-medium text-rose-700 bg-rose-50 px-1 py-0.2 rounded border border-rose-200">
                            DEFECT
                          </span>
                        )}
                        <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px] tabular-nums">
                          {formatConfidence(d.confidence)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: COMPONENT SPECIFICATIONS */}
        {rightPanelTab === 'details' && (
          <div className="space-y-3 text-xs">
            {matchedComponent ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="text-[10px] uppercase font-mono text-slate-400">Verified Component</div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {matchedComponent.name}
                  </h3>
                  <div className="text-slate-500 font-mono text-[11px]">{matchedComponent.mpn}</div>
                  <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {matchedComponent.description}
                  </p>
                </div>

                {/* Key Specs Table */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Electrical Specifications
                  </div>
                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {Object.entries(matchedComponent.keySpecs || {}).map(([key, val]) => (
                      <div key={key} className="flex justify-between p-2 bg-white dark:bg-slate-850">
                        <span className="text-slate-500">{key}</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200 text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Failure Modes & Troubleshooting */}
                {matchedComponent.failureModes && matchedComponent.failureModes.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Failure Modes & Diagnostics
                    </div>
                    <div className="space-y-1.5">
                      {matchedComponent.failureModes.map((fm, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-1">
                          <div className="font-medium text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{fm.symptom}</span>
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            <strong>Diagnostic Check:</strong> {fm.diagnosticCheck}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            <strong>Prevention:</strong> {fm.prevention}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                Select a component to view technical specifications
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PINOUT MATRIX */}
        {rightPanelTab === 'pinouts' && (
          <div className="space-y-3 text-xs">
            <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Arduino Uno R3 Pinout Map
            </div>
            <div className="space-y-2">
              {ARDUINO_UNO_PINOUT_GROUPS.map((group, idx) => (
                <div key={idx} className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 font-medium text-[11px] text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    {group.headerName}
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {group.pins.map((pin) => (
                      <div key={pin.pinNumber} className="p-2 flex items-center justify-between bg-white dark:bg-slate-850 hover:bg-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="w-5 font-mono text-[11px] text-slate-400">#{pin.pinNumber}</span>
                          <span className="font-mono font-medium text-teal-700 dark:text-teal-400">{pin.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 truncate max-w-[140px]">{pin.functions.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HEALTH SUMMARY */}
        {rightPanelTab === 'report' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-medium text-slate-500 uppercase">Composite Health Score</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {healthScore.toFixed(0)} <span className="text-xs font-normal text-slate-400">/ 100</span>
                </div>
              </div>
              <div className="text-center px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-400">GRADE</div>
                <div className="text-lg font-bold text-teal-700 dark:text-teal-400">{letterGrade}</div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden text-xs">
              <div className="p-2.5 flex justify-between bg-white dark:bg-slate-850">
                <span className="text-slate-500">Components Identified</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{activeBoard.detections.length}</span>
              </div>
              <div className="p-2.5 flex justify-between bg-white dark:bg-slate-850">
                <span className="text-slate-500">Defects Flagged</span>
                <span className={`font-mono font-medium ${activeBoard.defects.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {activeBoard.defects.length}
                </span>
              </div>
              <div className="p-2.5 flex justify-between bg-white dark:bg-slate-850">
                <span className="text-slate-500">Logic Supply</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">5.0V TTL</span>
              </div>
              <div className="p-2.5 flex justify-between bg-white dark:bg-slate-850">
                <span className="text-slate-500">Provenance</span>
                <span className="text-amber-700 font-medium">Simulated</span>
              </div>
            </div>

            {/* Flagged Defect Checklist */}
            {activeBoard.defects.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  Critical Defect Checklist
                </div>
                <div className="space-y-1.5">
                  {activeBoard.defects.map((df) => (
                    <div key={df.id} className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/60 dark:bg-rose-950/20 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-rose-800 dark:text-rose-300">{df.type}</span>
                        <span className="text-[10px] font-medium text-rose-700 bg-rose-100 dark:bg-rose-900/50 px-1.5 py-0.2 rounded">
                          {df.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">{df.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
