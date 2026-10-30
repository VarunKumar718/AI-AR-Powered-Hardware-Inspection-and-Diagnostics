'use client';

import React, { useState } from 'react';
import {
  ScanEye,
  Camera,
  Upload,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Info,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';
import { ArduinoUnoSvg } from '@/components/boards/ArduinoUnoSvg';
import { Esp32BoardSvg } from '@/components/boards/Esp32BoardSvg';
import { BreadboardSvg } from '@/components/boards/BreadboardSvg';
import { ProvenanceBadge } from '@/components/shell/ProvenanceBadge';
import { HARDWARE_COMPONENTS } from '@/data/components';
import { formatConfidence, getSeverityBadge } from '@/lib/utils';
import { Detection, Defect } from '@/types';

export default function StudioPage() {
  const {
    activeBoard,
    setActiveBoard,
    boards,
    selectedDetectionId,
    selectDetection,
    selectedDefectId,
    selectDefect,
    showOverlays,
    toggleOverlays,
    zoomLevel,
    setZoomLevel,
    aiMode,
    addToast,
  } = useVisionStore();

  const [isDismissedBanner, setIsDismissedBanner] = useState(false);

  // Selected detection details
  const selectedDetection = activeBoard.detections.find((d) => d.id === selectedDetectionId);
  const matchedComponent = selectedDetection
    ? HARDWARE_COMPONENTS.find((c) => c.id === selectedDetection.componentId)
    : null;

  // Selected defect details
  const selectedDefect = activeBoard.defects.find((d) => d.id === selectedDefectId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Studio Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-bg-card border border-border-subtle shadow-card-glass">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-brand-cyan">
            <ScanEye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-display font-bold text-text-primary">
                Inspection Studio Canvas
              </h1>
              <ProvenanceBadge source="simulated" />
            </div>
            <p className="text-xs text-text-muted">
              Interactive AR bounding box diagnostics & defect locator
            </p>
          </div>
        </div>

        {/* Board Variant Quick Toggle Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {boards.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setActiveBoard(b.id);
                addToast({
                  type: 'info',
                  title: 'Inspection Target Changed',
                  message: `Loaded ${b.name}`,
                });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 border ${
                b.id === activeBoard.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-glow font-bold'
                  : 'bg-bg-elevated text-text-secondary border-border-subtle hover:text-text-primary hover:border-cyan-500/30'
              }`}
            >
              {b.variant === 'defect_demo' ? '⚠️ Uno (Defect B)' : b.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Dismissible-but-recoverable Simulation Disclaimer Banner (Requirement) */}
      {!isDismissedBanner ? (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Simulation Mode Notice:</strong> Component boxes and defects are rendered by VisionGuard&apos;s
              offline deterministic hardware model. Confidence values illustrate threshold filtering and are not live neural network metrics.
            </span>
          </div>
          <button
            onClick={() => setIsDismissedBanner(true)}
            className="text-amber-400 hover:text-amber-200 font-mono text-[11px] underline ml-3 shrink-0"
          >
            Dismiss
          </button>
        </div>
      ) : (
        <div className="text-right">
          <button
            onClick={() => setIsDismissedBanner(false)}
            className="text-[11px] font-mono text-amber-400/80 hover:text-amber-300 underline"
          >
            Show Simulation Engine Notice
          </button>
        </div>
      )}

      {/* Main Studio Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {/* Canvas Frame Container */}
          <div className="relative rounded-2xl bg-bg-base/90 border border-border-strong p-4 md:p-6 shadow-2xl overflow-hidden flex flex-col items-center justify-center min-h-[460px]">
            {/* Scan-Line Sweep Overlay Animation */}
            <div className="scan-line-overlay" />

            {/* Floating AR Viewport Controls */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-bg-card/90 backdrop-blur-md border border-border-subtle">
              <button
                onClick={toggleOverlays}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                  showOverlays
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-text-muted hover:text-text-primary'
                }`}
                title="Toggle AR Bounding Boxes"
              >
                AR Overlays: {showOverlays ? 'ON' : 'OFF'}
              </button>
              <div className="w-[1px] h-4 bg-border-subtle" />
              <button
                onClick={() => setZoomLevel(zoomLevel + 0.15)}
                className="p-1 text-text-muted hover:text-brand-cyan"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(zoomLevel - 0.15)}
                className="p-1 text-text-muted hover:text-brand-cyan"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1.0)}
                className="p-1 text-text-muted hover:text-brand-cyan"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Top-Right Health Score Pill */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 backdrop-blur-md ${
                  activeBoard.healthScore >= 90
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                    : activeBoard.healthScore >= 60
                    ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                    : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                }`}
              >
                <span>Health Score:</span>
                <span className="text-sm">{activeBoard.healthScore.toFixed(1)}%</span>
              </div>
            </div>

            {/* Board Vector Art Mount */}
            <div
              className="w-full transition-transform duration-200 origin-center max-w-4xl"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {activeBoard.category === 'soc_board' ? (
                <Esp32BoardSvg
                  selectedDetectionId={selectedDetectionId}
                  onSelectDetection={(d) => selectDetection(d.id)}
                  detections={activeBoard.detections}
                  showOverlays={showOverlays}
                />
              ) : activeBoard.category === 'breadboard' ? (
                <BreadboardSvg
                  selectedDetectionId={selectedDetectionId}
                  onSelectDetection={(d) => selectDetection(d.id)}
                  detections={activeBoard.detections}
                  defects={activeBoard.defects}
                  showOverlays={showOverlays}
                />
              ) : (
                <ArduinoUnoSvg
                  isDefectVariant={activeBoard.variant === 'defect_demo'}
                  selectedDetectionId={selectedDetectionId}
                  selectedDefectId={selectedDefectId}
                  onSelectDetection={(d) => selectDetection(d.id)}
                  onSelectDefect={(def) => selectDefect(def.id)}
                  detections={activeBoard.detections}
                  defects={activeBoard.defects}
                  showOverlays={showOverlays}
                />
              )}
            </div>

            {/* Bottom Target Bar */}
            <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-[11px] font-mono text-text-muted bg-bg-card/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border-subtle">
              <span>FOV: 1200x800 px</span>
              <span className="text-brand-cyan">
                Detections: {activeBoard.detections.length} • Defects: {activeBoard.defects.length}
              </span>
              <span>Inference: ~210ms</span>
            </div>
          </div>
        </div>

        {/* Right: Inspection Inspector & Diagnostic Drawer (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Component or Defect Details Card */}
          {selectedDefect ? (
            /* DEFECT INSPECTION CARD */
            <div className="p-5 rounded-2xl bg-bg-card border border-rose-500/40 shadow-card-glass space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-mono text-xs font-bold text-rose-400">
                    {selectedDefect.id} DEFECT
                  </span>
                </div>
                {(() => {
                  const badge = getSeverityBadge(selectedDefect.severity);
                  return (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {badge.label}
                    </span>
                  );
                })()}
              </div>

              <div>
                <h3 className="text-base font-bold text-text-primary">
                  {selectedDefect.type}
                </h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  {selectedDefect.description}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-bg-elevated/70 border border-border-subtle space-y-1">
                  <div className="font-mono font-semibold text-text-primary text-[11px]">
                    Diagnostic Check:
                  </div>
                  <div className="text-text-secondary text-[11px]">
                    {selectedDefect.suggestedCheck}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-1">
                  <div className="font-mono font-semibold text-rose-300 text-[11px]">
                    Corrective Recommendation:
                  </div>
                  <div className="text-rose-200/90 text-[11px]">
                    {selectedDefect.recommendation}
                  </div>
                </div>
              </div>

              <button
                onClick={() => selectDefect(null)}
                className="w-full py-2 rounded-xl bg-bg-elevated hover:bg-bg-card border border-border-subtle text-xs font-mono text-text-secondary"
              >
                Clear Defect Selection
              </button>
            </div>
          ) : selectedDetection ? (
            /* COMPONENT INSPECTION CARD */
            <div className="p-5 rounded-2xl bg-bg-card border border-cyan-500/40 shadow-card-glass space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-brand-cyan">
                  {selectedDetection.designator || 'TARGET NODE'}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  Confidence: {formatConfidence(selectedDetection.confidence)}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-text-primary">
                  {selectedDetection.label}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono uppercase bg-bg-elevated px-2 py-0.5 rounded text-text-muted border border-border-subtle">
                    {selectedDetection.category}
                  </span>
                  {selectedDetection.footprint && (
                    <span className="text-[10px] font-mono text-text-secondary">
                      Pkg: {selectedDetection.footprint}
                    </span>
                  )}
                </div>
              </div>

              {matchedComponent && (
                <div className="space-y-2 text-xs">
                  <p className="text-text-secondary text-[11px] leading-relaxed line-clamp-3">
                    {matchedComponent.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-bg-elevated/70 border border-border-subtle space-y-1">
                    <div className="font-mono font-semibold text-text-primary text-[11px]">
                      Electrical Specs:
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-mono text-text-secondary pt-0.5">
                      <div>Voltage: {matchedComponent.operatingVoltage}</div>
                      <div>Risk: {matchedComponent.riskFactor.toUpperCase()}</div>
                      <div>MPN: {matchedComponent.mpn}</div>
                      <div>Mfr: {matchedComponent.manufacturer.split(' ')[0]}</div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => selectDetection(null)}
                className="w-full py-2 rounded-xl bg-bg-elevated hover:bg-bg-card border border-border-subtle text-xs font-mono text-text-secondary"
              >
                Deselect Component
              </button>
            </div>
          ) : (
            /* DEFAULT IDLE DRAWER */
            <div className="p-5 rounded-2xl bg-bg-card border border-border-subtle space-y-4">
              <div className="flex items-center gap-2 text-brand-cyan font-mono text-xs font-semibold">
                <Cpu className="w-4 h-4" />
                <span>ACTIVE BOARD OVERVIEW</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-text-primary">
                  {activeBoard.name}
                </h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                  {activeBoard.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-bg-elevated/50 border border-border-subtle space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-muted">MCU Architecture:</span>
                  <span className="font-mono text-text-secondary">{activeBoard.mcu.split(' (')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Detected Parts:</span>
                  <span className="font-mono text-brand-cyan font-semibold">{activeBoard.detections.length} elements</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">IPC Flagged Defects:</span>
                  <span className="font-mono text-rose-400 font-semibold">{activeBoard.defects.length} anomalies</span>
                </div>
              </div>

              <div className="text-[11px] text-text-muted bg-bg-base/60 p-3 rounded-xl border border-border-subtle">
                💡 <em>Click any component bounding box or defect marker on the canvas to inspect pinouts, ratings, and IPC-A-610 recommendations.</em>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
