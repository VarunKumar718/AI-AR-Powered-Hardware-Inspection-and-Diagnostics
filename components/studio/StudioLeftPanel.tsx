'use client';

import React, { useRef, useState } from 'react';
import {
  Upload,
  Camera,
  Cpu,
  Sliders,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Info,
  CameraOff,
  Video,
  Pause,
  AlertCircle,
  Layers,
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
  const [isOverlaysOpen, setIsOverlaysOpen] = useState(false);

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
    if (file.size > 20 * 1024 * 1024) {
      addToast({
        type: 'error',
        title: 'File Too Large',
        message: 'Maximum image size is 20 MB.',
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
  };

  if (isLeftPanelCollapsed) {
    return (
      <div className="w-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-3 shrink-0 z-20">
        <button
          onClick={toggleLeftPanel}
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Expand Controls Panel"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="[writing-mode:vertical-rl] text-xs font-medium text-slate-400 mt-6 uppercase rotate-180">
          Controls
        </span>
      </div>
    );
  }

  return (
    <aside className="w-full lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 h-full overflow-y-auto scrollbar-thin z-20 select-none">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Input & Controls
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <ProvenanceBadge source="simulated" />
          <button
            onClick={toggleLeftPanel}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            title="Collapse Panel"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-3.5 space-y-4">
        {/* 1. SOURCE SELECTOR TABS */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium uppercase text-slate-500 tracking-wider">
            Hardware Source Feed
          </label>
          <div className="grid grid-cols-3 gap-1 p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs">
            <button
              onClick={() => setSourceType('sample')}
              className={`py-1.5 px-2 rounded transition-colors flex items-center justify-center gap-1.5 text-xs font-medium ${
                sourceType === 'sample'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Sample</span>
            </button>
            <button
              onClick={() => setSourceType('upload')}
              className={`py-1.5 px-2 rounded transition-colors flex items-center justify-center gap-1.5 text-xs font-medium ${
                sourceType === 'upload'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
            <button
              onClick={() => {
                setSourceType('camera');
                if (!isCameraActive) startCamera();
              }}
              className={`py-1.5 px-2 rounded transition-colors flex items-center justify-center gap-1.5 text-xs font-medium ${
                sourceType === 'camera'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera</span>
            </button>
          </div>
        </div>

        {/* Source Sub-Panels */}
        {sourceType === 'sample' && (
          <div className="space-y-1.5">
            <div className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Select Sample Board:</span>
              <span className="font-mono text-slate-400">{boards.length} Available</span>
            </div>
            <div className="space-y-1">
              {boards.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBoard(b.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between border ${
                    b.id === activeBoardId
                      ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-600 dark:border-teal-500 font-medium'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="truncate">{b.name}</span>
                  {b.variant === 'defect_demo' && (
                    <span className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 px-1 py-0.2 rounded font-medium ml-1 shrink-0">
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
            {/* Minimal Drop Zone as requested: large dashed gray border, turns teal on drag */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors flex flex-col items-center justify-center text-center gap-2 ${
                dragActive
                  ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-teal-600 dark:hover:border-teal-500 bg-white dark:bg-slate-850'
              }`}
            >
              <Upload className={`w-6 h-6 ${dragActive ? 'text-teal-600' : 'text-slate-400'}`} />
              <div className="space-y-0.5">
                <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Drop a photo of your board here
                </div>
                <div className="text-[11px] text-slate-400">
                  or click to browse from your device
                </div>
              </div>
            </div>

            {uploadedImageMeta && (
              <div className="p-2 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span className="truncate max-w-[140px]">{uploadedImageMeta.name}</span>
                <span className="font-mono text-[11px] text-slate-400">{uploadedImageMeta.resolution}</span>
              </div>
            )}
          </div>
        )}

        {sourceType === 'camera' && (
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Status:</span>
              <span className={`font-medium ${isCameraActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                {isCameraActive ? (cameraFrozen ? 'Paused' : 'Streaming') : 'Inactive'}
              </span>
            </div>

            {cameraError && (
              <div className="p-2 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{cameraError}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {!isCameraActive ? (
                <button
                  onClick={startCamera}
                  className="w-full h-9 rounded-md bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Video className="w-4 h-4" />
                  <span>Start Camera</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleFreezeFrame}
                    className="flex-1 h-9 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {cameraFrozen ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    <span>{cameraFrozen ? 'Resume' : 'Freeze'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setCameraFrozen(false);
                      setIsCameraActive(false);
                      setSourceType('sample');
                    }}
                    className="h-9 px-2.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors"
                    title="Stop Camera"
                  >
                    <CameraOff className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* 2. PRIMARY SOLID TEAL ACTION BUTTON */}
        <div className="space-y-2 pt-1">
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className={`w-full h-10 px-4 rounded-md font-medium text-xs tracking-wide uppercase flex items-center justify-center gap-2 transition-colors ${
              isAnalyzing
                ? 'bg-teal-700 text-white/80 cursor-wait'
                : 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Scanning Feed...</span>
              </>
            ) : (
              <span>Run Vision Inspection</span>
            )}
          </button>

          {/* Thin, Simple Progress Bar as requested */}
          {isAnalyzing && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>{analysisStep}</span>
                <span className="font-mono">{analysisProgress}%</span>
              </div>
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 transition-all duration-150"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. DETECTION MODE */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 uppercase font-medium">Detection Mode</span>
            <span className="text-teal-700 dark:text-teal-300 font-medium capitalize">{detectionMode}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs">
            {(['fast', 'balanced', 'precise'] as DetectionMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setDetectionMode(mode)}
                className={`py-1 rounded capitalize transition-colors text-xs ${
                  detectionMode === mode
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 font-medium shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* 4. CONFIDENCE THRESHOLD SLIDER */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 uppercase font-medium text-[11px]">Confidence Cutoff</span>
            <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{(minConfidence * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="0.95"
            step="0.05"
            value={minConfidence}
            onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
            className="w-full accent-teal-600 h-1 bg-slate-200 dark:bg-slate-700 rounded cursor-pointer"
          />
        </div>

        {/* 5. CATEGORY FILTER CHIPS: simple gray chips with selected one in teal */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase font-medium text-slate-500">
            Category Filter
          </label>
          <div className="flex flex-wrap gap-1">
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
                  className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 border ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-600 dark:border-teal-500 font-medium'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] text-slate-400">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. OVERLAY TOGGLES: Collapsible section as requested */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-2.5">
          <button
            onClick={() => setIsOverlaysOpen(!isOverlaysOpen)}
            className="w-full flex items-center justify-between text-[11px] uppercase font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1"
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Overlay Layer Toggles</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOverlaysOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOverlaysOpen && (
            <div className="grid grid-cols-2 gap-1.5 pt-2 text-xs">
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
                    className={`p-1.5 rounded text-left transition-colors border flex items-center justify-between ${
                      active
                        ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-200'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span className="text-[11px] truncate">{item.label}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
