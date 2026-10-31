'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Download,
  AlertTriangle,
  Sparkles,
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
import { Detection, Category } from '@/types';

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
  } = useVisionStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoomLevel(Math.max(0.4, Math.min(3.0, zoomLevel * zoomFactor)));
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
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
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      setCursorCoords({
        x: Math.round(currentX),
        y: Math.round(currentY),
        normX: Number((currentX / rect.width).toFixed(3)),
        normY: Number((currentY / rect.height).toFixed(3)),
      });
    }

    if (isManualAnnotating && drawingBox && rect) {
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setDrawingBox({ ...drawingBox, currentX: x, currentY: y });
      return;
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
      return;
    }

    setIsDragging(false);
  };

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

  const exportSnapshot = () => {
    addToast({
      type: 'success',
      title: 'Annotated Export Generated',
      message: 'Downloaded annotated inspection diagram (PNG).',
    });
  };

  const visibleDetections = activeBoard.detections.filter((d) => {
    if (d.confidence < minConfidence) return false;
    if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
    return true;
  });

  const currentStepDef = ASSEMBLY_STEPS[assemblyStep] || ASSEMBLY_STEPS[0];

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDragging(false)}
      className={`relative w-full h-[620px] lg:h-[720px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm select-none ${
        isDragging ? 'cursor-grabbing' : isManualAnnotating ? 'cursor-crosshair' : 'cursor-default'
      }`}
    >
      {/* 1. TOP FLOATING CLEAN WHITE TOOLBAR */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        {/* Left Toolbar Cluster */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm pointer-events-auto">
          {/* Zoom controls */}
          <button
            onClick={() => setZoomLevel(zoomLevel + 0.15)}
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-xs text-slate-700 dark:text-slate-300 px-1.5 min-w-[38px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(zoomLevel - 0.15)}
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetViewport}
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Reset Viewport"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-3.5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* AR Guidance Mode Toggle */}
          <button
            onClick={() => setOverlayToggle('arGuidance')}
            className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              overlayToggles.arGuidance
                ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Toggle AR Pinouts & Signal Traces"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">AR HUD</span>
          </button>

          {/* Before / After Slider Toggle */}
          <button
            onClick={() => setCompareMode(compareMode === 'slider' ? 'none' : 'slider')}
            className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              compareMode === 'slider'
                ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Compare Reference vs Inspected Board"
          >
            <Split className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compare</span>
          </button>

          {/* Guided Assembly Mode Toggle */}
          <button
            onClick={() => setIsAssemblyMode(!isAssemblyMode)}
            className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              isAssemblyMode
                ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Step-by-step Assembly Guide"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Assembly Guide</span>
          </button>

          {/* Manual Annotation Mode */}
          <button
            onClick={() => setIsManualAnnotating(!isManualAnnotating)}
            className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              isManualAnnotating
                ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Draw manual bounding boxes"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Manual Box</span>
          </button>
        </div>

        {/* Right Toolbar Cluster */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm pointer-events-auto">
          {/* Export PNG */}
          <button
            onClick={exportSnapshot}
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Download PNG"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. GUIDED ASSEMBLY MODE BAR (When active) */}
      {isAssemblyMode && (
        <div className="absolute top-16 left-3 right-3 z-30 p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-center font-mono font-medium text-teal-700 dark:text-teal-300 text-xs">
              {currentStepDef.step}
            </div>
            <div>
              <div className="text-xs font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Step {currentStepDef.step} of 5: {currentStepDef.title}</span>
                <span className="text-[10px] text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.2 rounded font-medium">
                  {currentStepDef.targetIds.length} parts
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {currentStepDef.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-center">
            <button
              onClick={() => setAssemblyStep((prev) => Math.max(0, prev - 1))}
              disabled={assemblyStep === 0}
              className="p-1 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 disabled:opacity-40 text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs text-slate-500 px-1">
              {assemblyStep + 1} / 5
            </span>
            <button
              onClick={() => setAssemblyStep((prev) => Math.min(4, prev + 1))}
              disabled={assemblyStep === 4}
              className="p-1 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 disabled:opacity-40 text-slate-600 dark:text-slate-300"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. CENTER VIEWPORT WORKSPACE */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
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
            <div className="relative w-full aspect-[1200/800] rounded-lg overflow-hidden bg-black border border-slate-300">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 z-20 px-2 py-0.5 rounded bg-black/70 text-xs font-mono text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Live Camera Feed</span>
              </div>
            </div>
          )}

          {/* UPLOADED PHOTO VIEW */}
          {sourceType === 'upload' && uploadedImageUrl && (
            <div className="relative w-full aspect-[1200/800] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={uploadedImageUrl}
                alt="Uploaded PCB Hardware"
                className="w-full h-full object-contain"
              />
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

          {/* AR GUIDANCE OVERLAY LAYER (Clean non-neon paths) */}
          {overlayToggles.arGuidance && (
            <svg
              viewBox="0 0 1200 800"
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
            >
              <path
                d="M 235 440 H 420 V 490 H 525"
                fill="none"
                stroke="#0D9488"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <text x="310" y="432" fontFamily="JetBrains Mono" fontSize="10" fill="#0D9488" fontWeight="500">
                5.0V MAIN POWER RAIL
              </text>

              <path
                d="M 540 545 V 500"
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <text x="550" y="525" fontFamily="JetBrains Mono" fontSize="10" fill="#475569">
                16MHz XTAL
              </text>

              {activeBoard.variant === 'defect_demo' && (
                <g>
                  <circle cx="1070" cy="410" r="35" fill="none" stroke="#DC2626" strokeWidth="2" strokeDasharray="3 2" />
                  <path d="M 1070 375 L 1070 310 H 940" fill="none" stroke="#DC2626" strokeWidth="1.5" />
                  <rect x="800" y="295" width="160" height="24" rx="4" fill="#FEF2F2" stroke="#DC2626" strokeWidth="1" />
                  <text x="810" y="311" fontFamily="JetBrains Mono" fontSize="9" fontWeight="bold" fill="#DC2626">
                    DEFECT: SHORT CIRCUIT
                  </text>
                </g>
              )}
            </svg>
          )}

          {/* BEFORE / AFTER SLIDER REVEAL LAYER */}
          {compareMode === 'slider' && (
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none z-20 border-r-2 border-teal-600"
              style={{ width: `${compareSliderPosition}%` }}
            >
              <div className="w-[1200px] h-[800px] relative opacity-90 filter grayscale">
                <ArduinoUnoSvg
                  isDefectVariant={false}
                  showOverlays={false}
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* ACTIVE DRAWING RECTANGLE (Manual Annotation Mode) */}
          {isManualAnnotating && drawingBox && (
            <div
              className="absolute border-2 border-teal-600 bg-teal-500/10 pointer-events-none rounded"
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
            <div className="w-0.5 h-full bg-teal-600" />
            <input
              type="range"
              min="0"
              max="100"
              value={compareSliderPosition}
              onChange={(e) => setCompareSliderPosition(parseInt(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-10 -ml-5 h-full"
            />
            <div className="w-6 h-6 rounded-full bg-white border border-teal-600 text-teal-700 flex items-center justify-center text-xs shadow-sm font-bold">
              ↔
            </div>
          </div>
        )}
      </div>

      {/* 4. MANUAL ANNOTATION DIALOG MODAL */}
      {pendingBox && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px]">
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase">
                Tag Manual Annotation
              </span>
              <button
                onClick={() => setPendingBox(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] text-slate-500">Component Label / Designator</label>
                <input
                  type="text"
                  value={manualLabelInput}
                  onChange={(e) => setManualLabelInput(e.target.value)}
                  placeholder="e.g. U7 Optocoupler (PC817)"
                  className="w-full mt-1 px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-500">Category</label>
                <select
                  value={manualCategoryInput}
                  onChange={(e) => setManualCategoryInput(e.target.value as Category)}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-600"
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
                className="px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50"
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
                className="px-3.5 py-1.5 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium"
              >
                Save Annotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CANVAS BOTTOM STATUS BAR */}
      <div className="h-8 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 z-30 shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <span>
            X: {cursorCoords.x}px Y: {cursorCoords.y}px
          </span>
          <span className="hidden sm:inline">
            Norm: ({cursorCoords.normX}, {cursorCoords.normY})
          </span>
          <span className="hidden md:inline">
            Zoom: {Math.round(zoomLevel * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span>
            Detections: <strong className="text-slate-800 dark:text-slate-200">{visibleDetections.length}</strong> / {activeBoard.detections.length}
          </span>
          <span className="text-[#B45309] font-medium hidden sm:inline">
            MODEL: SIMULATED-v1.4
          </span>
        </div>
      </div>
    </div>
  );
};
