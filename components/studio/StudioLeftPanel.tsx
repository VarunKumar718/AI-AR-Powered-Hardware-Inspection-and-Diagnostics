'use client';

import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Camera,
  Cpu,
  Sliders,
  CheckSquare,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
  CameraOff,
  Video,
  Pause,
  AlertCircle,
  Clock,
  HardDrive,
  Maximize2,
} from 'lucide-react';
import { useVisionStore, InputSourceType, DetectionMode, OverlayToggles } from '@/store/useVisionStore';
import { ProvenanceBadge } from '@/components/shell/ProvenanceBadge';
import { Category } from '@/types';

const CATEGORIES: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'microcontroller', label: 'MCU' },
  { id: 'ic', label: 'IC' },
  { id: 'power', label: 'Power' },
  { id: 'passive', label: 'Passive' },
  { id: 'header', label: 'Header' },
  { id: 'connector', label: 'Connector' },
  { id: 'crystal', label: 'Crystal' },
  { id: 'led', label: 'LED' },
];

export const StudioLeftPanel: React.FC = () => {
  const {
    sourceType,
    setSourceType,
    uploadedImageUrl,
    uploadedImageMeta,
    setUploadedImage,
    isCameraActive,
    setIsCameraActive,
    cameraFrozen,
    setCameraFrozen,
    setCameraStream,
    boards,
    activeBoardId,
    setActiveBoard,
    isAnalyzing,
    analysisProgress,
    analysisStep,
    runAnalysis,
    minConfidence,
    setMinConfidence,
    categoryFilter,
    setCategoryFilter,
    overlayToggles,
    setOverlayToggle,
    detectionMode,
    setDetectionMode,
    activeBoard,
    lastInferenceMs,
    isLeftPanelCollapsed,
    toggleLeftPanel,
    addToast,
  } = useVisionStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Handle Drag & Drop for Image Upload
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processUploadedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast({
        type: 'error',
        title: 'Invalid File Format',
        message: 'Please upload an image file (PNG, JPG, WEBP, or BMP).',
      });
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'File Too Large',
        message: 'Maximum image size is 15 MB.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setUploadedImage(url, {
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          resolution: `${img.width}x${img.height}`,
        });
        addToast({
          type: 'success',
          title: 'Image Loaded',
          message: `${file.name} loaded locally in browser.`,
        });
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Webcam initialization & fallback
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API (getUserMedia) not supported in this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' },
        audio: false,
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      setCameraFrozen(false);
      setSourceType('camera');
      addToast({
        type: 'success',
        title: 'Camera Connected',
        message: 'Live hardware video feed active.',
      });
    } catch (err: any) {
      console.warn('[VisionGuard Camera Error]', err);
      const msg = err.name === 'NotAllowedError'
        ? 'Camera permission denied. Falling back to Sample Board.'
        : 'No webcam hardware detected. Falling back to Sample Board.';
      setCameraError(msg);
      setSourceType('sample');
      addToast({
        type: 'warning',
        title: 'Camera Unavailable',
        message: msg,
      });
    }
  };

  const toggleFreezeFrame = () => {
    setCameraFrozen(!cameraFrozen);
    addToast({
      type: 'info',
      title: cameraFrozen ? 'Camera Resumed' : 'Frame Frozen',
      message: cameraFrozen ? 'Live video streaming resumed.' : 'Captured freeze-frame for inspection.',
    });
  };

  if (isLeftPanelCollapsed) {
    return (
      <div className="w-12 bg-bg-card border-r border-border-subtle flex flex-col items-center py-4 shrink-0 z-20">
        <button
          onClick={toggleLeftPanel}
          className="p-2 rounded-lg bg-bg-elevated text-brand-cyan hover:bg-cyan-500/20 transition-colors"
          title="Expand Controls Panel"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <span className="[writing-mode:vertical-rl] text-xs font-mono tracking-widest text-text-muted mt-8 uppercase rotate-180">
          Inspection Controls
        </span>
      </div>
    );
  }

  return (
    <aside className="w-full lg:w-80 bg-bg-card/95 border-r border-border-subtle flex flex-col shrink-0 h-full overflow-y-auto scrollbar-thin z-20 select-none">
      {/* Panel Header */}
      <div className="p-4 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-brand-cyan" />
          <h2 className="text-sm font-display font-bold text-text-primary tracking-wide">
            Input & Controls
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge source="simulated" />
          <button
            onClick={toggleLeftPanel}
            className="p-1 rounded text-text-muted hover:text-text-primary"
            title="Collapse Panel"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* 1. SOURCE SELECTOR TABS */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase text-text-muted font-semibold tracking-wider">
            Hardware Source Feed
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-bg-base border border-border-subtle text-xs font-mono">
            <button
              onClick={() => setSourceType('sample')}
              className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                sourceType === 'sample'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Sample</span>
            </button>
            <button
              onClick={() => setSourceType('upload')}
              className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                sourceType === 'upload'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
            <button
              onClick={() => {
                setSourceType('camera');
                if (!isCameraActive) startCamera();
              }}
              className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                sourceType === 'camera'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera</span>
            </button>
          </div>
        </div>

        {/* Source Sub-Panels */}
        {sourceType === 'sample' && (
          <div className="p-3 rounded-xl bg-bg-base/70 border border-border-subtle space-y-2">
            <div className="text-[11px] font-mono text-text-muted flex items-center justify-between">
              <span>Select Sample Board:</span>
              <span className="text-brand-cyan">{boards.length} Available</span>
            </div>
            <div className="space-y-1.5">
              {boards.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBoard(b.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between border ${
                    b.id === activeBoardId
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold shadow-cyan-glow'
                      : 'hover:bg-bg-elevated text-text-secondary border-transparent'
                  }`}
                >
                  <span className="truncate">{b.name}</span>
                  {b.variant === 'defect_demo' && (
                    <span className="text-[10px] text-rose-400 font-bold px-1.5 py-0.2 rounded bg-rose-950/60 border border-rose-500/30">
                      5 Defects
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {sourceType === 'upload' && (
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/bmp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processUploadedFile(e.target.files[0]);
                }
              }}
            />
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 ${
                dragActive
                  ? 'border-cyan-400 bg-cyan-500/10 scale-[1.02]'
                  : 'border-border-strong hover:border-cyan-400/50 bg-bg-base/60'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-brand-cyan">
                <UploadCloud className="w-5 h-5 animate-pulse-subtle" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-text-primary">
                  Click or drag PCB photo
                </div>
                <div className="text-[10px] text-text-muted">
                  PNG, JPG, WEBP (Max 15MB)
                </div>
              </div>
            </div>

            {uploadedImageMeta && (
              <div className="p-2.5 rounded-xl bg-bg-elevated/70 border border-border-subtle text-[11px] font-mono text-text-secondary flex items-center justify-between">
                <span className="truncate max-w-[140px]">{uploadedImageMeta.name}</span>
                <span className="text-brand-cyan">{uploadedImageMeta.resolution}</span>
              </div>
            )}

            <div className="text-[10px] text-text-muted flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
              <span>Images are processed 100% locally in your browser memory.</span>
            </div>
          </div>
        )}

        {sourceType === 'camera' && (
          <div className="p-3.5 rounded-xl bg-bg-base/70 border border-border-subtle space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-text-secondary">Camera Status:</span>
              <span className={`font-mono font-bold ${isCameraActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isCameraActive ? (cameraFrozen ? 'FROZEN' : 'STREAMING') : 'INACTIVE'}
              </span>
            </div>

            {cameraError && (
              <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-[11px] text-rose-300 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{cameraError}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {!isCameraActive ? (
                <button
                  onClick={startCamera}
                  className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-bg-deepest font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Video className="w-4 h-4" />
                  <span>Start Camera</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleFreezeFrame}
                    className="flex-1 py-2 rounded-xl bg-bg-elevated hover:bg-bg-card border border-border-subtle text-xs font-mono text-text-primary flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {cameraFrozen ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{cameraFrozen ? 'Resume' : 'Freeze'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setCameraFrozen(false);
                      setIsCameraActive(false);
                      setSourceType('sample');
                    }}
                    className="p-2 rounded-xl bg-bg-elevated hover:bg-rose-950/40 border border-border-subtle text-text-muted hover:text-rose-400"
                    title="Stop Camera"
                  >
                    <CameraOff className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* 2. PRIMARY GLOWING ANALYZE BUTTON */}
        <div className="space-y-2 pt-1">
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className={`w-full py-3.5 px-4 rounded-2xl font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg ${
              isAnalyzing
                ? 'bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 cursor-wait'
                : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-300 text-bg-deepest hover:scale-[1.02] active:scale-95 shadow-cyan-glow cursor-pointer'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
                <span>Scanning Feed...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Run Vision Inspection</span>
              </>
            )}
          </button>

          {/* Staged Analysis Progress */}
          {isAnalyzing && (
            <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-brand-cyan">{analysisStep}</span>
                <span className="text-text-muted">{analysisProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-bg-base rounded-full overflow-hidden border border-border-subtle">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-200"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. DETECTION MODE (Fast / Balanced / Precise) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-text-muted font-semibold uppercase">Detection Mode</span>
            <span className="text-brand-cyan font-bold capitalize">{detectionMode}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-bg-base border border-border-subtle text-xs font-mono">
            {(['fast', 'balanced', 'precise'] as DetectionMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setDetectionMode(mode)}
                className={`py-1 rounded-lg capitalize transition-colors ${
                  detectionMode === mode
                    ? 'bg-bg-elevated text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* 4. CONFIDENCE THRESHOLD SLIDER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-text-muted font-semibold uppercase">Confidence Cutoff</span>
            <span className="text-emerald-400 font-bold">{(minConfidence * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="0.95"
            step="0.05"
            value={minConfidence}
            onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-bg-base rounded-lg cursor-pointer"
          />
        </div>

        {/* 5. CATEGORY FILTER CHIPS */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase text-text-muted font-semibold">
            Category Filter
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const isSelected = categoryFilter === cat.id;
              const count =
                cat.id === 'all'
                  ? activeBoard.detections.length
                  : activeBoard.detections.filter((d) => d.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1 border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                      : 'bg-bg-base/70 text-text-secondary border-border-subtle hover:text-text-primary'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. OVERLAY TOGGLES */}
        <div className="space-y-2 pt-1 border-t border-border-subtle">
          <label className="text-[11px] font-mono uppercase text-text-muted font-semibold">
            Overlay Layer Toggles
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {[
              { key: 'boxes' as keyof OverlayToggles, label: 'Bounding Boxes' },
              { key: 'labels' as keyof OverlayToggles, label: 'Component Tags' },
              { key: 'confidence' as keyof OverlayToggles, label: 'Confidence %' },
              { key: 'pinouts' as keyof OverlayToggles, label: 'Pinout Markers' },
              { key: 'connections' as keyof OverlayToggles, label: 'Signal Traces' },
              { key: 'defects' as keyof OverlayToggles, label: 'Defect Marks' },
              { key: 'heatmap' as keyof OverlayToggles, label: 'Thermal Heatmap' },
              { key: 'arGuidance' as keyof OverlayToggles, label: 'AR HUD Guide' },
            ].map((item) => {
              const active = overlayToggles[item.key];
              return (
                <button
                  key={item.key}
                  onClick={() => setOverlayToggle(item.key)}
                  className={`p-2 rounded-xl text-left transition-all border flex items-center justify-between ${
                    active
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                      : 'bg-bg-base/60 border-border-subtle text-text-muted hover:text-text-primary'
                  }`}
                >
                  <span className="text-[11px] truncate">{item.label}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${active ? 'bg-cyan-400' : 'bg-slate-600'}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. SESSION INFO CARD */}
        <div className="p-3 rounded-xl bg-bg-base/80 border border-border-subtle space-y-1.5 text-[11px] font-mono text-text-muted">
          <div className="flex justify-between items-center">
            <span>Inference Time:</span>
            <span className="text-emerald-400 font-bold">{lastInferenceMs} ms</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Active Board:</span>
            <span className="text-text-secondary truncate max-w-[130px]">{activeBoard.name.split(' (')[0]}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Defects Found:</span>
            <span className={activeBoard.defects.length > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
              {activeBoard.defects.length} items
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
