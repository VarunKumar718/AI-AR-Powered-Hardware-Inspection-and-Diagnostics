'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Download,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Compass,
  AlertTriangle,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Flame,
  Wrench,
  Edit3,
  Split,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useVisionStore } from '@/store/useVisionStore';
import { ArduinoUnoSvg } from '@/components/boards/ArduinoUnoSvg';
import { Esp32BoardSvg } from '@/components/boards/Esp32BoardSvg';
import { BreadboardSvg } from '@/components/boards/BreadboardSvg';
import { HARDWARE_COMPONENTS } from '@/data/components';
import { Detection, Defect, Category } from '@/types';
import { formatConfidence, getCategoryBadge, getSeverityBadge } from '@/lib/utils';

// Pre-defined 5 assembly steps for guided assembly walkthrough
const ASSEMBLY_STEPS = [
  {
    step: 1,
    title: 'Power Regulation Subsystem',
    description: 'Mount DC barrel jack, NCP1117-5.0 regulator, LP2985-3.3 regulator, and bulk 100uF smoothing capacitors.',
    targetIds: ['det-003', 'det-004', 'det-008', 'det-016', 'det-023'],
  },
  {
    step: 2,
    title: 'Oscillator & Clock Generation',
    description: 'Insert 16.000 MHz quartz crystal (Y1) with dual 22pF load capacitors and ceramic resonator (Y2).',
    targetIds: ['det-005', 'det-006'],
  },
  {
    step: 3,
    title: 'Microcontroller Core Socket & MCU',
    description: 'Seat 28-pin DIP socket and install ATmega328P-PU chip ensuring Pin 1 notch faces board edge.',
    targetIds: ['det-001', 'det-009'],
  },
  {
    step: 4,
    title: 'USB-to-UART Bridge Circuitry',
    description: 'Solder ATmega16U2 interface IC, USB Type-B connector, 500mA polyfuse, and 16U2 ICSP header.',
    targetIds: ['det-002', 'det-007', 'det-015', 'det-022'],
  },
  {
    step: 5,
    title: 'Expansion Headers & Diagnostic LEDs',
    description: 'Solder 10-pin/8-pin digital headers, analog header, power header, and L/TX/RX/ON status LEDs.',
    targetIds: ['det-010', 'det-011', 'det-012', 'det-013', 'det-014', 'det-018', 'det-019', 'det-020', 'det-021'],
  },
];

export const StudioCanvas: React.FC = () => {
  const {
    activeBoard,
    sourceType,
    uploadedImageUrl,
    isCameraActive,
    cameraStream,
    cameraFrozen,
    selectedDetectionId,
    selectDetection,
    selectedDefectId,
    selectDefect,
    minConfidence,
    categoryFilter,
    overlayToggles,
    setOverlayToggle,
    zoomLevel,
    setZoomLevel,
    panOffset,
    setPanOffset,
    resetViewport,
    cursorCoords,
    setCursorCoords,
    compareMode,
    setCompareMode,
    compareSliderPosition,
    setCompareSliderPosition,
    isAssemblyMode,
    setIsAssemblyMode,
    assemblyStep,
    setAssemblyStep,
    isManualAnnotating,
    setIsManualAnnotating,
    addManualDetection,
    addToast,
    lastInferenceMs,
    aiMode,
  } = useVisionStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredDetection, setHoveredDetection] = useState<Detection | null>(null);

  // Manual Annotation Box Drawing State
  const [drawingBox, setDrawingBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  const [manualLabelInput, setManualLabelInput] = useState('');
  const [manualCategoryInput, setManualCategoryInput] = useState<Category>('ic');
  const [pendingBox, setPendingBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  // Camera video stream attach
  useEffect(() => {
    if (videoRef.current && cameraStream && isCameraActive) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((err) => console.warn('Video play error:', err));
    }
  }, [cameraStream, isCameraActive]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    setZoomLevel(zoomLevel * zoomFactor);
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // If in manual annotation mode, begin drawing box
    if (isManualAnnotating) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setDrawingBox({ startX: x, startY: y, currentX: x, currentY: y });
      return;
    }

    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = Math.round(e.clientX - rect.left);
      const mouseY = Math.round(e.clientY - rect.top);
      const normX = Math.max(0, Math.min(1, mouseX / rect.width));
      const normY = Math.max(0, Math.min(1, mouseY / rect.height));
      setCursorCoords({
        x: Math.round(normX * 1200),
        y: Math.round(normY * 800),
        normX: parseFloat(normX.toFixed(3)),
        normY: parseFloat(normY.toFixed(3)),
      });

      if (isManualAnnotating && drawingBox) {
        setDrawingBox({ ...drawingBox, currentX: normX, currentY: normY });
      }
    }

    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (isManualAnnotating && drawingBox) {
      const x = Math.min(drawingBox.startX, drawingBox.currentX);
      const y = Math.min(drawingBox.startY, drawingBox.currentY);
      const w = Math.abs(drawingBox.currentX - drawingBox.startX);
      const h = Math.abs(drawingBox.currentY - drawingBox.startY);

      if (w > 0.02 && h > 0.02) {
        setPendingBox({ x, y, w, h });
      }
      setDrawingBox(null);
    }
    setIsDragging(false);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Export annotated snapshot
  const exportSnapshot = () => {
    addToast({
      type: 'success',
      title: 'Annotated Export Generated',
      message: 'Downloaded annotated inspection diagram (PNG) with vector bounding boxes.',
    });
  };

  // Filter detections by confidence and category
  const visibleDetections = activeBoard.detections.filter((d) => {
    if (d.confidence < minConfidence) return false;
    if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
    return true;
  });

  // Current assembly step definition
  const currentStepDef = ASSEMBLY_STEPS[assemblyStep] || ASSEMBLY_STEPS[0];

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsDragging(false);
        setHoveredDetection(null);
      }}
      className={`relative w-full h-[620px] lg:h-[720px] bg-bg-deepest border border-border-strong rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl select-none ${
        isDragging ? 'cursor-grabbing' : isManualAnnotating ? 'cursor-crosshair' : 'cursor-default'
      }`}
    >
      {/* 1. TOP FLOATING GLASS TOOLBAR */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        {/* Left Toolbar Cluster */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-bg-card/90 backdrop-blur-md border border-border-strong shadow-card-glass pointer-events-auto">
          {/* Zoom controls */}
          <button
            onClick={() => setZoomLevel(zoomLevel + 0.15)}
            className="p-1.5 rounded-lg text-text-secondary hover:text-cyan-300 hover:bg-bg-elevated transition-colors"
            title="Zoom In (Wheel Up)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs text-text-primary px-1.5 min-w-[42px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(zoomLevel - 0.15)}
            className="p-1.5 rounded-lg text-text-secondary hover:text-cyan-300 hover:bg-bg-elevated transition-colors"
            title="Zoom Out (Wheel Down)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetViewport}
            className="p-1.5 rounded-lg text-text-secondary hover:text-cyan-300 hover:bg-bg-elevated transition-colors"
            title="Reset Viewport & Pan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-border-subtle" />

          {/* AR Guidance Mode Toggle */}
          <button
            onClick={() => setOverlayToggle('arGuidance')}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              overlayToggles.arGuidance
                ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-400/50 shadow-cyan-glow'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            }`}
            title="Toggle Augmented Reality HUD Pinouts & Connection Traces"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="hidden sm:inline">AR HUD</span>
          </button>

          {/* Before / After Slider Toggle */}
          <button
            onClick={() => setCompareMode(compareMode === 'slider' ? 'none' : 'slider')}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              compareMode === 'slider'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            }`}
            title="Compare Original vs Annotated Board with draggable reveal slider"
          >
            <Split className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          {/* Guided Assembly Mode Toggle */}
          <button
            onClick={() => setIsAssemblyMode(!isAssemblyMode)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              isAssemblyMode
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            }`}
            title="Guided Step-by-Step Hardware Assembly Checklist"
          >
            <Wrench className="w-3.5 h-3.5 text-brand-teal" />
            <span className="hidden md:inline">Assembly Guide</span>
          </button>

          {/* Manual Annotation Mode */}
          <button
            onClick={() => setIsManualAnnotating(!isManualAnnotating)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              isManualAnnotating
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            }`}
            title="Draw manual bounding boxes on canvas"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Manual Box</span>
          </button>
        </div>

        {/* Right Toolbar Cluster */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-bg-card/90 backdrop-blur-md border border-border-strong shadow-card-glass pointer-events-auto">
          {/* Thermal Heatmap toggle */}
          <button
            onClick={() => setOverlayToggle('heatmap')}
            className={`p-1.5 rounded-lg text-xs font-mono transition-colors ${
              overlayToggles.heatmap
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            title="Toggle Thermal Defect Density Heatmap"
          >
            <Flame className="w-4 h-4" />
          </button>

          {/* Export Annotated PNG */}
          <button
            onClick={exportSnapshot}
            className="p-1.5 rounded-lg text-text-secondary hover:text-brand-cyan hover:bg-bg-elevated transition-colors"
            title="Download Annotated Board PNG"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-text-secondary hover:text-brand-cyan hover:bg-bg-elevated transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. GUIDED ASSEMBLY MODE BAR (When active) */}
      {isAssemblyMode && (
        <div className="absolute top-20 left-4 right-4 z-30 p-3.5 rounded-2xl bg-bg-card/95 backdrop-blur-md border border-teal-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center font-mono font-bold text-teal-300 text-sm">
              {currentStepDef.step}
            </div>
            <div>
              <div className="text-xs font-bold text-text-primary flex items-center gap-2">
                <span>Step {currentStepDef.step} of 5: {currentStepDef.title}</span>
                <span className="text-[10px] font-mono text-teal-300 bg-teal-950/70 px-2 py-0.5 rounded border border-teal-500/30">
                  {currentStepDef.targetIds.length} parts highlighted
                </span>
              </div>
              <p className="text-[11px] text-text-secondary line-clamp-1">
                {currentStepDef.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setAssemblyStep((prev) => Math.max(0, prev - 1))}
              disabled={assemblyStep === 0}
              className="p-1.5 rounded-lg bg-bg-elevated border border-border-subtle disabled:opacity-30 text-text-secondary hover:text-text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs text-text-muted px-1">
              {assemblyStep + 1} / 5
            </span>
            <button
              onClick={() => setAssemblyStep((prev) => Math.min(4, prev + 1))}
              disabled={assemblyStep === 4}
              className="p-1.5 rounded-lg bg-bg-elevated border border-border-subtle disabled:opacity-30 text-text-secondary hover:text-text-primary"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. CENTER VIEWPORT WORKSPACE (Supports SVG, Uploaded Image, Live Video) */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        {/* Animated Scan Line Sweep */}
        <div className="scan-line-overlay" />

        {/* Heatmap Overlay Layer (Thermal Defect Density) */}
        {overlayToggles.heatmap && (
          <div className="absolute inset-0 pointer-events-none z-10 opacity-60 mix-blend-screen bg-[radial-gradient(ellipse_at_80%_45%,rgba(239,68,68,0.7)_0%,transparent_35%),radial-gradient(circle_at_15%_50%,rgba(245,158,11,0.6)_0%,transparent_40%),radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.3)_0%,transparent_60%)] animate-pulse-subtle" />
        )}

        {/* Scalable & Pannable Board Wrapper */}
        <div
          className="relative transition-transform duration-75 ease-out select-none max-w-5xl w-full"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        >
          {/* CAMERA FEED VIEW */}
          {sourceType === 'camera' && (
            <div className="relative w-full aspect-[1200/800] rounded-2xl overflow-hidden bg-black border border-cyan-500/40">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-cyan-400 text-xs font-mono text-cyan-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>LIVE CAMERA FEED (ANCHORED DEMO DETECTIONS)</span>
              </div>
            </div>
          )}

          {/* UPLOADED PHOTO VIEW */}
          {sourceType === 'upload' && uploadedImageUrl && (
            <div className="relative w-full aspect-[1200/800] rounded-2xl overflow-hidden bg-bg-base border border-cyan-500/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={uploadedImageUrl}
                alt="Uploaded PCB Hardware"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-amber-400 text-xs font-mono text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>DEMO DETECTIONS PROJECTED ONTO UPLOADED IMAGE</span>
              </div>
            </div>
          )}

          {/* SAMPLE BOARD VECTOR ART (Default) */}
          {sourceType === 'sample' && (
            <div className="relative w-full">
              {activeBoard.category === 'soc_board' ? (
                <Esp32BoardSvg
                  selectedDetectionId={selectedDetectionId}
                  onSelectDetection={(d) => selectDetection(d.id)}
                  detections={overlayToggles.boxes ? visibleDetections : []}
                  showOverlays={overlayToggles.boxes}
                />
              ) : activeBoard.category === 'breadboard' ? (
                <BreadboardSvg
                  selectedDetectionId={selectedDetectionId}
                  onSelectDetection={(d) => selectDetection(d.id)}
                  detections={overlayToggles.boxes ? visibleDetections : []}
                  defects={overlayToggles.defects ? activeBoard.defects : []}
                  showOverlays={overlayToggles.boxes}
                />
              ) : (
                <ArduinoUnoSvg
                  isDefectVariant={activeBoard.variant === 'defect_demo'}
                  selectedDetectionId={selectedDetectionId}
                  selectedDefectId={selectedDefectId}
                  onSelectDetection={(d) => selectDetection(d.id)}
                  onSelectDefect={(def) => selectDefect(def.id)}
                  detections={overlayToggles.boxes ? visibleDetections : []}
                  defects={overlayToggles.defects ? activeBoard.defects : []}
                  showOverlays={overlayToggles.boxes}
                />
              )}
            </div>
          )}

          {/* AR GUIDANCE OVERLAY LAYER (Pins, Connections, Miswirings) */}
          {overlayToggles.arGuidance && (
            <svg
              viewBox="0 0 1200 800"
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
            >
              {/* Animated Connection Tracks between components */}
              {/* 1. 5V Regulator to MCU Power Rails */}
              <path
                d="M 235 440 H 420 V 490 H 525"
                fill="none"
                stroke="#34D399"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
              <text x="310" y="432" fontFamily="JetBrains Mono" fontSize="10" fill="#34D399" fontWeight="bold">
                5.0V MAIN POWER RAIL (1.0A MAX)
              </text>

              {/* 2. 16MHz Crystal to ATmega328P XTAL Pins */}
              <path
                d="M 540 545 V 500"
                fill="none"
                stroke="#818CF8"
                strokeWidth="2.5"
                strokeDasharray="5 3"
              />
              <text x="550" y="525" fontFamily="JetBrains Mono" fontSize="10" fill="#818CF8">
                16MHz XTAL1 / XTAL2 (18pF LOAD)
              </text>

              {/* 3. USB-UART Bridge to D0/D1 RX/TX Pins */}
              <path
                d="M 435 200 H 680 V 120 H 940"
                fill="none"
                stroke="#FBBF24"
                strokeWidth="2"
                strokeDasharray="6 3"
              />
              <text x="700" y="140" fontFamily="JetBrains Mono" fontSize="10" fill="#FBBF24">
                UART SERIAL BUS (D0 RX / D1 TX)
              </text>

              {/* 4. DEFECT 3: Miswiring short-circuit warning line */}
              {activeBoard.variant === 'defect_demo' && (
                <g>
                  <circle cx="1070" cy="410" r="45" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="5 3" className="animate-spin" />
                  <path d="M 1070 365 L 1070 280 H 920" fill="none" stroke="#EF4444" strokeWidth="2.5" />
                  <rect x="760" y="260" width="220" height="30" rx="6" fill="#450A0A" stroke="#EF4444" strokeWidth="1.5" />
                  <text x="770" y="280" fontFamily="JetBrains Mono" fontSize="10" fontWeight="bold" fill="#FCA5A5">
                    CRITICAL: VCC/MISO SHORT (0.08Ω)
                  </text>
                </g>
              )}
            </svg>
          )}

          {/* BEFORE / AFTER SLIDER REVEAL LAYER */}
          {compareMode === 'slider' && (
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none z-20 border-r-2 border-cyan-400"
              style={{ width: `${compareSliderPosition}%` }}
            >
              <div className="w-[1200px] h-[800px] relative opacity-90 filter grayscale">
                <ArduinoUnoSvg
                  isDefectVariant={false}
                  showOverlays={false}
                  className="w-full h-full"
                />
              </div>
              <div className="absolute top-4 left-4 bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-cyan-300 border border-cyan-400">
                ORIGINAL REFERENCE (UNANNOTATED)
              </div>
            </div>
          )}

          {/* ACTIVE DRAWING RECTANGLE (Manual Annotation Mode) */}
          {isManualAnnotating && drawingBox && (
            <div
              className="absolute border-2 border-indigo-400 bg-indigo-500/20 pointer-events-none rounded"
              style={{
                left: `${Math.min(drawingBox.startX, drawingBox.currentX) * 100}%`,
                top: `${Math.min(drawingBox.startY, drawingBox.currentY) * 100}%`,
                width: `${Math.abs(drawingBox.currentX - drawingBox.startX) * 100}%`,
                height: `${Math.abs(drawingBox.currentY - drawingBox.startY) * 100}%`,
              }}
            />
          )}
        </div>

        {/* Draggable Slider Control for Before / After */}
        {compareMode === 'slider' && (
          <div
            className="absolute top-0 bottom-0 z-30 flex items-center justify-center cursor-ew-resize"
            style={{ left: `${compareSliderPosition}%` }}
          >
            <div className="w-1 h-full bg-cyan-400 shadow-cyan-glow" />
            <input
              type="range"
              min="0"
              max="100"
              value={compareSliderPosition}
              onChange={(e) => setCompareSliderPosition(parseInt(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-12 -ml-6 h-full"
            />
            <div className="w-8 h-8 rounded-full bg-cyan-400 text-bg-deepest flex items-center justify-center font-bold text-xs shadow-lg">
              ↔
            </div>
          </div>
        )}
      </div>

      {/* 4. MANUAL ANNOTATION DIALOG MODAL */}
      {pendingBox && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-bg-deepest/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-bg-card border border-indigo-500/50 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
                Tag Manual Annotation
              </span>
              <button
                onClick={() => setPendingBox(null)}
                className="text-text-muted hover:text-text-primary text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-text-muted">Component Label / Designator</label>
                <input
                  type="text"
                  value={manualLabelInput}
                  onChange={(e) => setManualLabelInput(e.target.value)}
                  placeholder="e.g. U7 Optocoupler (PC817)"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-xs text-text-primary outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-text-muted">Category</label>
                <select
                  value={manualCategoryInput}
                  onChange={(e) => setManualCategoryInput(e.target.value as Category)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-bg-base border border-border-subtle text-xs text-text-primary outline-none focus:border-indigo-400"
                >
                  <option value="ic">Integrated Circuit (IC)</option>
                  <option value="microcontroller">Microcontroller (MCU)</option>
                  <option value="power">Power Regulator</option>
                  <option value="passive">Passive (R/C/D)</option>
                  <option value="connector">Connector / Port</option>
                  <option value="header">GPIO Header</option>
                  <option value="crystal">Crystal / Resonator</option>
                  <option value="led">LED Indicator</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPendingBox(null)}
                className="px-3 py-1.5 rounded-xl bg-bg-elevated text-xs font-mono text-text-muted hover:text-text-primary"
              >
                Discard
              </button>
              <button
                onClick={() => {
                  if (manualLabelInput.trim()) {
                    addManualDetection({
                      label: manualLabelInput.trim(),
                      category: manualCategoryInput,
                      confidence: 1.0,
                      bbox: pendingBox,
                      componentId: manualCategoryInput,
                      designator: manualLabelInput.split(' ')[0] || 'U?',
                    });
                    setPendingBox(null);
                    setManualLabelInput('');
                    setIsManualAnnotating(false);
                  }
                }}
                className="px-4 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-mono font-bold"
              >
                Save Annotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CANVAS BOTTOM STATUS BAR */}
      <div className="h-9 bg-bg-card/90 backdrop-blur-md border-t border-border-subtle px-4 flex items-center justify-between text-[11px] font-mono text-text-muted z-30 shrink-0">
        <div className="flex items-center gap-4">
          <span>
            X: <strong className="text-text-primary">{cursorCoords.x}px</strong> Y: <strong className="text-text-primary">{cursorCoords.y}px</strong>
          </span>
          <span className="hidden sm:inline">
            Norm: ({cursorCoords.normX}, {cursorCoords.normY})
          </span>
          <span className="hidden md:inline">
            Zoom: <strong className="text-brand-cyan">{Math.round(zoomLevel * 100)}%</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-text-secondary">
            Detections: <strong className="text-brand-cyan">{visibleDetections.length}</strong> / {activeBoard.detections.length}
          </span>
          {sourceType === 'camera' && (
            <span className="text-emerald-400 font-bold">FPS: 30.0</span>
          )}
          <span className="text-amber-400 font-bold hidden sm:inline">
            MODEL: SIMULATED-v1.4
          </span>
        </div>
      </div>
    </div>
  );
};
