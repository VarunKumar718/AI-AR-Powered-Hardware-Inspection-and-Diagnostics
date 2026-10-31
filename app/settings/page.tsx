'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Cpu,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  Eye,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useVisionStore, DetectionMode } from '@/store/useVisionStore';
import { apiClient, HealthResponse } from '@/lib/api/client';
import Link from 'next/link';

export default function SettingsPage() {
  const {
    aiMode,
    setAiMode,
    detectionMode,
    setDetectionMode,
    minConfidence,
    setMinConfidence,
    overlayToggles,
    setOverlayToggle,
    lastInferenceMs,
  } = useVisionStore();

  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [pingError, setPingError] = useState<string | null>(null);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  const testBackend = async () => {
    setIsPinging(true);
    setPingError(null);
    const start = performance.now();
    try {
      const data = await apiClient.getHealth();
      const latency = Math.round(performance.now() - start);
      setBackendHealth(data);
      setPingLatency(latency);
    } catch (err: any) {
      setPingError(err.message || 'Unable to connect to FastAPI backend on port 8000.');
      setBackendHealth(null);
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    testBackend();
  }, [aiMode]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Header Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-bg-card via-bg-elevated to-bg-card border border-border-strong p-6 md:p-8 shadow-card-glass">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
                Engine & Data Configuration
              </span>
              <span className="text-xs font-mono text-text-muted">
                Runtime: {aiMode.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight">
              Settings & Inspection Calibration
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Toggle between offline deterministic simulation and live neural model execution, configure YOLO detection sensitivity, and customize visual inspection overlays.
            </p>
          </div>

          <Link
            href="/studio"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-bg-deepest font-semibold text-xs transition-all shadow-cyan-glow shrink-0"
          >
            <span>Open Studio</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2. Engine Data Mode Card */}
      <div className="rounded-2xl border border-border-strong bg-bg-card p-6 space-y-5 shadow-card-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-brand-cyan tracking-wider flex items-center gap-1 font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              Inference Data Engine
            </span>
            <h2 className="text-lg font-mono font-bold text-text-primary">
              AI Engine Execution Mode
            </h2>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2 p-1 bg-bg-deepest rounded-xl border border-border-subtle">
            <button
              onClick={() => setAiMode('simulated')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                aiMode === 'simulated'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Simulation Mode
            </button>
            <button
              onClick={() => {
                setAiMode('model');
                testBackend();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                aiMode === 'model'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Real AI (Live Backend)
            </button>
          </div>
        </div>

        {/* Live Backend Telemetry Details */}
        {aiMode === 'model' && (
          <div className="space-y-4 pt-2">
            {backendHealth ? (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    FastAPI PyTorch Core Connected (200 OK)
                  </span>
                  <span className="text-text-muted font-normal text-[11px]">
                    Ping: {pingLatency} ms
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-emerald-500/20">
                  <div>
                    <span className="text-text-muted block text-[10px]">DEVICE:</span>
                    <strong className="text-text-primary">{backendHealth.device}</strong>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px]">VERSION:</span>
                    <strong className="text-text-primary">v{backendHealth.version}</strong>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px]">MODELS:</span>
                    <strong className="text-brand-cyan">{backendHealth.models.length} Loaded</strong>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px]">UPTIME:</span>
                    <strong className="text-text-primary">{Math.round(backendHealth.uptimeSeconds)}s</strong>
                  </div>
                </div>

                <div className="text-[11px] text-text-muted pt-1">
                  Primary Model: <span className="text-cyan-200">{backendHealth.models[0]}</span>
                </div>
              </div>
            ) : pingError ? (
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between text-red-300 font-bold">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Backend Not Reachable
                  </span>
                  <button
                    onClick={testBackend}
                    disabled={isPinging}
                    className="flex items-center gap-1 text-[11px] text-brand-cyan hover:underline"
                  >
                    <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
                    <span>Retry Ping</span>
                  </button>
                </div>

                <p className="text-text-secondary text-xs">
                  {pingError}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setAiMode('simulated')}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-mono transition-all"
                  >
                    Switch Back to Simulation Mode
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-bg-deepest border border-border-subtle text-xs font-mono text-text-muted flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-cyan" />
                <span>Pinging live backend /backend/health...</span>
              </div>
            )}
          </div>
        )}

        {aiMode === 'simulated' && (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs font-mono text-amber-200/90 leading-relaxed">
            Operating in deterministic offline simulation mode. Component coordinates and defects are rendered using pre-calculated reference vectors without requiring the Python neural service.
          </div>
        )}
      </div>

      {/* 3. Detection Calibration */}
      <div className="rounded-2xl border border-border-strong bg-bg-card p-6 space-y-5 shadow-card-glass">
        <div className="space-y-1 border-b border-border-subtle pb-4">
          <span className="text-[10px] font-mono uppercase text-brand-cyan tracking-wider flex items-center gap-1 font-semibold">
            <Sliders className="w-3.5 h-3.5" />
            Detection Tuning
          </span>
          <h2 className="text-lg font-mono font-bold text-text-primary">
            YOLO Sensitivity & Precision Mode
          </h2>
        </div>

        {/* Confidence Threshold Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-text-primary font-bold">Minimum Confidence Threshold</span>
            <span className="text-brand-cyan font-bold">{Math.round(minConfidence * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.95"
            step="0.05"
            value={minConfidence}
            onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-text-muted">
            <span>10% (High Recall / Cluttered)</span>
            <span>Balanced (65%)</span>
            <span>95% (High Precision / Strict)</span>
          </div>
        </div>

        {/* Detection Mode Tabs */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-mono text-text-primary font-bold block">
            Inference Preset
          </span>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { id: 'fast', title: 'Fast (640px)', desc: 'Lowest latency (~130ms)' },
                { id: 'balanced', title: 'Balanced (800px)', desc: 'Optimal trade-off (~210ms)' },
                { id: 'precise', title: 'Precise (1024px)', desc: 'Deepest feature map (~320ms)' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setDetectionMode(m.id as DetectionMode)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  detectionMode === m.id
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-100 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'bg-bg-deepest hover:bg-bg-elevated border-border-subtle text-text-muted hover:text-text-primary'
                }`}
              >
                <span className="font-mono font-bold text-xs block text-text-primary">{m.title}</span>
                <span className="text-[10px] font-mono text-text-muted block mt-0.5">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Canvas Overlays Toggle Grid */}
      <div className="rounded-2xl border border-border-strong bg-bg-card p-6 space-y-4 shadow-card-glass">
        <div className="space-y-1 border-b border-border-subtle pb-4">
          <span className="text-[10px] font-mono uppercase text-brand-cyan tracking-wider flex items-center gap-1 font-semibold">
            <Eye className="w-3.5 h-3.5" />
            Inspection Visual Overlays
          </span>
          <h2 className="text-lg font-mono font-bold text-text-primary">
            Canvas Layer Toggles
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          {(
            [
              { key: 'boxes', label: 'Bounding Boxes' },
              { key: 'labels', label: 'Designator Labels' },
              { key: 'confidence', label: 'Confidence %' },
              { key: 'defects', label: 'IPC Defect Markers' },
              { key: 'pinouts', label: 'Pinout Markers' },
              { key: 'connections', label: 'Signal Traces' },
              { key: 'heatmap', label: 'Thermal Heatmap' },
              { key: 'arGuidance', label: 'AR Alignment HUD' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => setOverlayToggle(item.key)}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                overlayToggles[item.key]
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-brand-cyan'
                  : 'bg-bg-deepest border-border-subtle text-text-muted hover:text-text-primary'
              }`}
            >
              <span>{item.label}</span>
              <span className={`w-2 h-2 rounded-full ${overlayToggles[item.key] ? 'bg-cyan-400' : 'bg-gray-600'}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
